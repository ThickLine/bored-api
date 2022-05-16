const express = require('express')
const router = express.Router()
const apicache = require('apicache')
const { getAIValue } = require('./suggestion');
const { body, validationResult } = require('express-validator');
/**
* @api {post} /api/story Create story
* @apiName Create new story

*
* @apiParam  {String} [topic] Topic
* @apiParam  {String} [count] Count

*
* @apiSuccess (200) {Object} mixed `Story` object
*/


// Init cache
const cache = apicache.middleware

router.post('/',  cache("1 second"),
// Validate topic
 body('topic').exists().withMessage('Topic is required'),
// Validate count
 body('count').exists().withMessage('Count is required'),

async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Replace count to upercase
    const { count }=req.body
    const c = count.replace(/^\w/, (f) => f.toUpperCase());
    // Create story mock
    const payload=`"\nTopic: ${req.body.topic} \n${c}-Sentence Horror Story"`;
    // Receive story suggestion
     const data = await getAIValue(payload);
    // Create story
    const story = {
      "topic": req.body.topic,
      "story":data.suggestion
    }
    res.status(200).json(story);
  } catch (error) {
    next(error)
  }
})



module.exports = router
