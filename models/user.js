const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

//create a schema for the user collection in the database
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters']
  },
})

//fire a function after doc saved to db
userSchema.post('save', function (doc, next) {
  console.log('new user was created & saved', doc)
  next()
})

//fire a function before doc saved to db ans hash the password
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

//static method to login user and check if the email and password are correct
userSchema.statics.login = async function (email, password) {
  //find the user with the email
  const user = await this.findOne({ email })
  if (user) {
    //compare the password
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error('incorrect password')
  }
  throw Error('incorrect email')
}

const User = mongoose.model('user', userSchema)

module.exports = User
