const express = require('express')
const router = express.Router()
const apicache = require('apicache')
const { getAIValue } = require('./suggestion');
const { body, validationResult } = require('express-validator');
/**
* @api {post} /api/recipe Create recipe
* @apiName Create new recipe

*
* @apiParam  {String[]} [ingredients] Ingredients
*
* @apiSuccess (200) {Object} mixed `Recipe` object
*/


// Init cache
const cache = apicache.middleware

router.post('/',  cache("1 second"),

// Validate ingredients
 body('ingredients')
 .exists().withMessage('Ingredients is required')
 .isArray().withMessage('Ingredients must be array')
 .isLength({ min: 1 }).withMessage('Must be atleast one ingredient'),

async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Replace count to upercase
    const ingredients=req.body.ingredients.join("\n");

    // Create story mock
    const payload=`"Write a recipe based on these ingredients and instructions:\n${ingredients} \nInstructions:"`;
    // Receive story suggestion
     const data = await getAIValue(payload);
    // Create story
    const recipe = {
      "instructions":data.suggestion
    }
    res.status(200).json(recipe);
  } catch (error) {
    next(error)
  }
})



module.exports = router
