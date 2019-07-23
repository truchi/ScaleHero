const { Model } = require('mongorito')

module.exports = class User extends Model {
  say(what) {
    console.log(what)
  }
}
