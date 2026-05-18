import { Response } from 'express';
import { validationResult } from 'express-validator';
import { Parser } from 'json2csv';
import Lead from '../models/Lead';
import { AuthRequest, LeadFilters, LeadStatus, LeadSource } from '../types';
import { sendSuccess, sendError, buildPaginationMeta } from '../utils/response';
import mongoose from 'mongoose';

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = 1,
      limit = 10,
    } = req.query as unknown as LeadFilters;

    const filter: mongoose.FilterQuery<typeof Lead> = {};

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email'),
      Lead.countDocuments(filter),
    ]);

    const meta = buildPaginationMeta(total, pageNum, limitNum);
    sendSuccess(res, leads, 'Leads fetched successfully', 200, meta);
  } catch (error) {
    console.error('Get leads error:', error);
    sendError(res, 'Failed to fetch leads', 500);
  }
};

export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendError(res, 'Invalid lead ID', 400);
      return;
    }

    const lead = await Lead.findById(id).populate('createdBy', 'name email');
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    sendSuccess(res, lead, 'Lead fetched successfully');
  } catch (error) {
    sendError(res, 'Failed to fetch lead', 500);
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 'Validation failed', 422, errors.array().map((e) => e.msg));
      return;
    }

    const { name, email, status, source, notes } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status: status || 'New',
      source,
      notes,
      createdBy: req.user?.id,
    });

    const populated = await lead.populate('createdBy', 'name email');
    sendSuccess(res, populated, 'Lead created successfully', 201);
  } catch (error) {
    console.error('Create lead error:', error);
    sendError(res, 'Failed to create lead', 500);
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 'Validation failed', 422, errors.array().map((e) => e.msg));
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendError(res, 'Invalid lead ID', 400);
      return;
    }

    // Sales users can only update status
    const updateData = req.user?.role === 'sales'
      ? { status: req.body.status }
      : req.body;

    const lead = await Lead.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    sendSuccess(res, lead, 'Lead updated successfully');
  } catch (error) {
    console.error('Update lead error:', error);
    sendError(res, 'Failed to update lead', 500);
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendError(res, 'Invalid lead ID', 400);
      return;
    }

    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    sendSuccess(res, null, 'Lead deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete lead', 500);
  }
};

export const exportLeadsCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search } = req.query as {
      status?: LeadStatus;
      source?: LeadSource;
      search?: string;
    };

    const filter: mongoose.FilterQuery<typeof Lead> = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    const fields = ['name', 'email', 'status', 'source', 'notes', 'createdAt'];
    const data = leads.map((lead) => ({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      notes: lead.notes || '',
      createdAt: lead.createdAt.toISOString(),
    }));

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    sendError(res, 'Failed to export leads', 500);
  }
};
