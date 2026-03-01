import express from 'express';
import { 
  createTicket, 
  getAllTickets, 
  getMyTasks, 
  updateTicketStatus, 
  reassignTicket, 
  closeTicket, 
  addComment, 
  addAttachment,
  getTicketById,
  deleteTicket,
  getTicketStats
} from '../controllers/ticket.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Create a new ticket
router.post('/', createTicket);

// Get all tickets (with optional filters)
router.get('/', getAllTickets);

// Get my tasks (tickets assigned to current user)
router.get('/my', getMyTasks);

// Get ticket statistics
router.get('/stats', getTicketStats);

// Get ticket by ID
router.get('/:id', getTicketById);

// Update ticket status
router.patch('/:id/status', updateTicketStatus);

// Reassign ticket (Admin/Manager only)
router.patch('/:id/reassign', reassignTicket);

// Close ticket (Admin/Manager only)
router.patch('/:id/close', closeTicket);

// Add comment to ticket
router.post('/:id/comment', addComment);

// Add attachment to ticket
router.post('/:id/attachment', addAttachment);

// Delete ticket (Admin only)
router.delete('/:id', deleteTicket);

export default router;
