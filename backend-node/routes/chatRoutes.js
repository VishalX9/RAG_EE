
const express = require('express');
const router = express.Router();
const { askAI, getHistory } = require('../controllers/chatController');
const auth = require('../middleware/auth'); 


router.post('/ask-ai', auth, askAI);
router.get('/history', auth, getHistory);

module.exports = router;