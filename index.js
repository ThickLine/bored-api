const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()
const errorHandler = require('./middleware/error')
const basicAuth = require('express-basic-auth')

const PORT = process.env.PORT || 5000


const PASS=process.env.PASS

const app = express()

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

// Error handler middleware
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
