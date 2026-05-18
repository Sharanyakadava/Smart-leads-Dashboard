import { Router } from 'express';
import { body } from 'express-validator';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leadsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All leads routes require authentication
router.use(authenticate);

const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('source').isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

const updateValidation = [
  body('name').optional().trim().notEmpty().isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('source').optional().isIn(['Website', 'Instagram', 'Referral']),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),
  body('notes').optional().isLength({ max: 500 }),
];

router.get('/', getLeads);
router.get('/export', authorize('admin'), exportLeadsCSV);
router.get('/:id', getLeadById);
router.post('/', authorize('admin'), leadValidation, createLead);
router.put('/:id', updateValidation, updateLead);
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
