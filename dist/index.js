"use strict";

var express = require('express');

var cors = require('cors');

var rateLimit = require('express-rate-limit');

require('dotenv').config();

var errorHandler = require('./middleware/error');

var PORT = process.env.PORT || 5000;
var app = express(); // Rate limiting

var limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  // 10 Mins
  max: 100
});
app.use(limiter);
app.set('trust proxy', 1); // Enable cors

app.use(cors()); // Routes

app.use('/api', require('./routes/bored.js'));
app.use('/generate', require('./routes/generate.js')); // Error handler middleware

app.use(errorHandler);
app.listen(PORT, function () {
  return console.log("Server running on port ".concat(PORT));
});