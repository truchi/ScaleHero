const { Database } = require('mongorito')

// Models to register to MongoDB
// NOTE automagic?
const models = [
  'User',
  'Lesson',
]

// MongoDB database object
const db = new Database('localhost/scalehero', { reconnectTries: 5 })
// Registering models
for(let model of models) db.register(require(`./models/${ model }`))

// MongoDB connection
;(async () => { await db.connect() })()

;(async () => {
  const User   = require('./models/User')
  const Lesson = require('./models/Lesson')

  const u = new User  ({ name : 'Romain' })
  const l = new Lesson({ title: 'Lesson 1', user: u })
  await l.save()
  console.log('Saved')
})()
