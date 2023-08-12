const User = require('../models/user')
const jwt = require('jsonwebtoken')


// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code)
  let errors = { email: '', password: '' }

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'that email is not registered'
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'that password is incorrect'
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.email = 'that email is already registered'
    return errors
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  }

  return errors
}


// create json web token
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
  return jwt.sign({ id }, 'test123', {
    expiresIn: maxAge
  })
}

//signup_get
module.exports.signup_get = (req, res) => {
  res.render('signup')
}

//login_get
module.exports.login_get = (req, res) => {
  res.render('login')
}

//signup_post
module.exports.signup_post = async (req, res) => {
  // res.send('new signup')
  const { email, password } = req.body

  try {
    const user = await User.create({ email, password })
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err)
    console.log(err)
    res.status(400).json({ errors })
  }
}

//login_post
module.exports.login_post = async (req, res) => {
  // res.send('user login')
  const { email, password } = req.body

  try {
    //if the user is found and the password is correct, then create a token
    const user = await User.login(email, password)
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(200).json({user: user._id})
  } catch (err) {
    const errors = handleErrors(err)
    console.log(err)
    res.status(400).json({ errors })
  }
}

//logout_get
module.exports.logout_get = (req, res) => {
  // res.send('user logout')
  //replace the jwt cookie with a blank one with no value and a tiny expiry time
  res.cookie('jwt', '', { maxAge: 1 })
  res.redirect('/')
}