const express = require('express');

const {protect, restrictTo} = require('../middleware/auth');
// const { upload } = require('../middleware/upload');
// const { createTicket, readTickets, readOneTicket, updateTickets, deleteTicket } = require('../controllers/ticket.controller');

const ticketRoutes = (createTicket, readTickets, readOneTicket, updateTickets, deleteTicket) => {
    const router = express.Router();
    // only logged in users
    router.post('/', protect, createTicket);
    
    //read tickets
    router.get('/', protect, restrictTo('user', 'agent', 'admin'), readTickets);
    
    //read only specific ticket
    router.get('/:id', protect, restrictTo('user', 'agent', 'admin'), readOneTicket);
    
    //update the ticket
    router.patch('/:id', protect, restrictTo('admin', 'agent'), updateTickets);
    
    //delete the ticket
    router.delete('/:id', protect, restrictTo('admin'), deleteTicket);

    router.post('/', protect, upload.single('attachment'), createTicket);

    // router.get('/:id/attachment', protect, getAttachment);

    return router;
}


module.exports = ticketRoutes;