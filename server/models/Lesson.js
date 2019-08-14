const { Model } = require('mongorito')
const User      = require('./User')

class Lesson extends Model {}

Lesson.embeds('user', User)

module.exports = Lesson
