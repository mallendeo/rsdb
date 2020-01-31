const { EventEmitter } = require('events')
const fs = require('fs-extra')
const exitHook = require('exit-hook')

let timeout
const stores = {}

const emitter = new EventEmitter()

module.exports = ({
  path = 'db.json',
  onUpdate = () => {},
  pretty,
  throttle = 200,
  initialData = {},
} = {}) => {
  !stores[path] && fs.ensureFileSync(path)

  const data = { ...initialData, ...fs.readJSONSync(path, { throws: false }) }

  const save = sync =>
    fs[sync ? 'writeJSONSync' : 'writeJSON'](path, data, {
      spaces: pretty && 2,
    })

  emitter.on('update', args => onUpdate(...args))

  const handler = {
    get(target, key) {
      if (typeof target[key] === 'object' && target[key] !== null) {
        return new Proxy(target[key], handler)
      }

      return target[key]
    },
    set(target, key, value) {
      emitter.emit('update', [path, key, value])

      target[key] = value

      clearTimeout(timeout)
      throttle = typeof throttle === 'number' ? throttle : throttle ? 200 : 0
      timeout = setTimeout(save, throttle)

      return true
    },
  }

  if (!stores[path]) {
    save()
    exitHook(() => save(true))
  }

  return (stores[path] = stores[path] || new Proxy(data, handler))
}
