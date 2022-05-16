const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()
const errorHandler = require('./middleware/error')
const basicAuth = require('express-basic-auth')
const bodyParser = require('body-parser')


const PORT = process.env.PORT || 5000


const PASS=process.env.PASS

const app = express()

// parse various different custom JSON types as JSON
app.use(bodyParser.json())

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }))



// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Mins
  max: 100,
})

app.use(limiter, basicAuth({
  users: { 'app': PASS },
  unauthorizedResponse: getUnauthorizedResponse
}))
app.set('trust proxy', 1)

function getUnauthorizedResponse(req) {
  return req.auth
      ? (`Credentials ${req.auth.user}:${req.auth.password} rejected`)
      : 'No credentials provided'
}

// Enable cors
app.use(cors())




// Routes
app.use('/api', require('./routes/bored'))
app.use('/generate', require('./routes/generate'))
app.use('/story', require('./routes/story'))
app.use('/recipe', require('./routes/recipe'))

// Error handler middleware
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
