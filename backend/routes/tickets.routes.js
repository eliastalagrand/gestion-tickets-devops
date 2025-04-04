const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/tickets.controller');

// Routes CRUD basiques pour les tickets
router.get('/', ticketsController.getAllTickets);
router.get('/:id', ticketsController.getTicketById);
router.post('/', ticketsController.createTicket);
router.put('/:id', ticketsController.updateTicket);
router.delete('/:id', ticketsController.deleteTicket);
router.put('/:id/status', ticketsController.updateStatus);
router.put('/:id/status', ticketsController.updateStatusAndComment);


module.exports = router;
