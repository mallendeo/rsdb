# 💾 rsdb
Really simple database for node apps. It uses a `Proxy` to detect object changes.

## Install

```bash
yarn add rsdb
# or npm i rsdb
```

## Usage

```js
import rsdb from 'rsdb'

const db = rsdb({
  // Every instance will be a singleton for each path.
  // This means you can define the same config on multiple files, and
  // you don't have to worry about instances overwriting each other.
  path: 'db.json',
  onUpdate: (dbPath, key, value) => {}, // callback executed on each change
  pretty: false, // JSON formatting
  throttle: 200, // {boolean|number} ms before saving to disk after a change
  initialData: {},
})

// Now you use `db` as if it were a normal object.
// rsdb will save your changes automatically.

db.doggos = []
db.doggos.push({ name: 'doge', breed: 'shiba-inu' })

db.config = {
  cacheTTL: 1000,
  deep: {
    nested: {
      props: {},
    },
  }
}

db.config.deep.nested.props.value = true

const db2 = rsdb({
  path: 'db2.json',
  throttle: false, // save to disk instantly
  initialData: {
    users: [{
      id: 1,
      username: 'keanu'
    }]
  },
  onUpdate: (dbPath, key, value) => {
    console.log(`db ${dbPath} changed`, key, value)
  },
})

db2.users[0].admin = true
db2.users.push({ id: 2, username: 'linus' })
delete db2.users[1]
```

## Test

```bash
npm test
```

# License

MIT
