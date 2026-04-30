const express = require('express');
const router = express.Router();
const controller = require('../controllers/ticketController');
const { authenticate, requireAdmin, requireStaff } = require('../middleware/auth');

router.use(authenticate);

router.get('/', controller.listTickets);
router.post('/', controller.createTicket);
router.get('/:id', controller.getTicket);

// Staff updates (Admin & Support)
router.put('/:id', requireStaff, controller.updateTicket);
router.put('/:id/assign', requireStaff, controller.assignTicket);

// Manager only
router.delete('/:id', requireAdmin, controller.deleteTicket);

module.exports = router;
