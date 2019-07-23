const { Database } = require('mongorito')

// Models to register to MongoDB
const models = [
  'User',
]

// MongoDB database object
const db = new Database('localhost/scalehero', { reconnectTries: 5 })
// Registering models
for(let model of models) db.register(require(`./models/${ model }`))

// MongoDB connection
;(async () => { await db.connect() })()
