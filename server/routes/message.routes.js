const express = require('express');
const { protect } = require('../middleware/auth');

const messageRoutes = (getMessage, sendMessage) => {
    const router = express.Router();

    router.get('/:ticketId', protect, getMessage);
    router.post('/:ticketId', protect, sendMessage);

    return router;
};

module.exports = messageRoutes;