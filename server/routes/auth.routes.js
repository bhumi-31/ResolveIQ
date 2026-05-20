const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getAgents } = require('../controllers/auth.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/me', protect, getMe);

router.get('/agents', protect, restrictTo('admin'), getAgents);

module.exports = router;