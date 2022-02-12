
const url = require('url')
const express = require('express')
const router = express.Router()
const needle = require('needle')
const apicache = require('apicache')
const { getAIValue } = require('./suggestion');

// Env vars
const API_BASE_URL = process.env.API_BASE_URL


// Init cache
const cache = apicache.middleware

router.get('/', cache("1 second"), async (req, res, next) => {
  try {
    const params = new URLSearchParams({
      ...url.parse(req.url, true).query,
    })

    const apiRes = await needle('get', `${API_BASE_URL}?${params}`)
    const activity = apiRes.body;
    const suggestion=await getAIValue(activity.activity);
// combine payload
    const payload={
  ...activity,
  ...suggestion

};

    // Log the request to the public API
    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${API_BASE_URL}?${params}`)
    }

    res.status(200).json(payload)
  } catch (error) {
    next(error)
  }
})

module.exports = router
