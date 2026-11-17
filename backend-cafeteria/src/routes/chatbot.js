const express = require('express');
const { postPrompt } = require('../controllers/chatbot');
const requireJsonObject = require('../middlewares/require-json-object');

const router = express.Router();

router.post('/', requireJsonObject, postPrompt);

module.exports = router;
