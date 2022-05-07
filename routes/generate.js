const express = require('express')
const router = express.Router()
const apicache = require('apicache')
const { getAIValue } = require('./suggestion');

// Init cache
const cache = apicache.middleware

router.get('/', cache("1 second"), async (req, res, next) => {
  try {
    const question = req.query.question;
    const data = await getAIValue(question);
    res.status(200).json(data);

  } catch (error) {
    next(error)
  }
})



module.exports = router
