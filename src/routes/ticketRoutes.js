const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/', ticketController.createTicket);
router.get('/', ticketController.getAllTickets);
router.patch('/:ticketId/assign', ticketController.assignArtisan);
router.patch('/:ticketId/status', ticketController.updateStatus);

module.exports = router;
