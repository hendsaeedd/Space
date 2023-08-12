const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())


// view engine
app.set('view engine', 'ejs')

// database connection
const dbURI = process.env.DB_URI
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => console.log(err));


// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'))
app.get('/space', requireAuth, (req, res) => res.render('space'))

// auth routes
app.use(authRoutes)
