const url = require('url')
const Joi = require('joi');
const express = require('express')
const router = express.Router()
const needle = require('needle')
const apicache = require('apicache')
const { Configuration, OpenAIApi } = require("openai");


// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE

const configuration = new Configuration({
    apiKey: API_KEY_VALUE,
  });
  const openai = new OpenAIApi(configuration);

// Init cache
const cache = apicache.middleware

router.get('/', cache("1 second"), async (req, res, next) => {
  try {
    // const params = new URLSearchParams({
    //   ...url.parse(req.url, true).query,
    // })

    const schema = Joi.object().keys({
      question: Joi.string()
  });
    const question = req.query.question;

    const value=schema.validate({ question: req.query.question});
    console.log(value);
    const completion = await openai.createCompletion("text-davinci-001", {
        prompt: question,
        temperature: 0.7,
        max_tokens: 60,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      res.status(200).json({ result: completion.data.choices[0].text });


  } catch (error) {
    next(error)
  }
})

module.exports = router
