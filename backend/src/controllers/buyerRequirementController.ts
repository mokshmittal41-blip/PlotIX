import { Request, Response } from 'express';
import { propertyStore } from '../db/propertyStore';

export const buyerRequirementController = {
  /**
   * GET /api/buyer-requirements
   */
  async listRequirements(req: Request, res: Response): Promise<void> {
    try {
      const { district } = req.query;
      const list = await propertyStore.queryBuyerRequirements(district as string);
      res.status(200).json({
        success: true,
        data: list
      });
    } catch (err: any) {
      console.error('[BuyerRequirementController] list error:', err);
      res.status(500).json({ success: false, error: 'Failed to fetch requirements.' });
    }
  },

  /**
   * GET /api/buyer-requirements/my-requirements
   */
  async getMyRequirements(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Authentication required.' });
        return;
      }
      const list = await propertyStore.queryBuyerRequirements(undefined, userId);
      res.status(200).json({
        success: true,
        data: list
      });
    } catch (err: any) {
      console.error('[BuyerRequirementController] getMyRequirements error:', err);
      res.status(500).json({ success: false, error: 'Failed to fetch your requirements.' });
    }
  },

  /**
   * POST /api/buyer-requirements
   */
  async createRequirement(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || null;
      const body = req.body;

      const title = (body.title || '').trim();
      const propertyType = (body.property_type || body.propertyType || '').trim();
      const district = (body.district || 'Rewari').trim();
      const rawBudgetMax = body.budget_max || body.budgetMax;
      const buyerName = (body.buyer_name || body.buyerName || req.user?.user_metadata?.full_name || 'Buyer').trim();
      const buyerPhone = (body.buyer_phone || body.buyerPhone || req.user?.phone || '').trim();

      if (!title) {
        res.status(400).json({ success: false, error: 'Requirement title is required.' });
        return;
      }

      if (!buyerPhone) {
        res.status(400).json({ success: false, error: 'Contact phone number is required.' });
        return;
      }

      const budgetMax = typeof rawBudgetMax === 'number' ? rawBudgetMax : parseFloat(String(rawBudgetMax).replace(/[^\d.]/g, '')) || 0;

      const result = await propertyStore.createBuyerRequirement({
        user_id: userId,
        title,
        property_type: propertyType || 'Residential Plot',
        district,
        preferred_area: body.preferred_area || body.preferredArea || district,
        budget_min: body.budget_min || body.budgetMin ? parseFloat(String(body.budget_min || body.budgetMin).replace(/[^\d.]/g, '')) : undefined,
        budget_max: budgetMax,
        required_size: body.required_size || body.requiredSize || '',
        purpose: body.purpose || 'Immediate Purchase',
        buyer_name: buyerName,
        buyer_phone: buyerPhone,
        status: 'active'
      });

      if (!result.success || !result.requirement) {
        res.status(400).json({ success: false, error: result.error || 'Failed to post requirement.' });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Requirement posted successfully! Matching local brokers have been alerted.',
        data: result.requirement
      });
    } catch (err: any) {
      console.error('[BuyerRequirementController] create error:', err);
      res.status(500).json({ success: false, error: 'Failed to post buyer requirement.' });
    }
  },

  /**
   * DELETE /api/buyer-requirements/:id
   */
  async deleteRequirement(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!id) {
        res.status(400).json({ success: false, error: 'Requirement ID is required.' });
        return;
      }

      const result = await propertyStore.deleteBuyerRequirement(id, userId);

      if (!result.success) {
        res.status(400).json({ success: false, error: result.error || 'Failed to delete requirement.' });
        return;
      }

      res.status(200).json({ success: true, message: 'Requirement inquiry removed.' });
    } catch (err: any) {
      console.error('[BuyerRequirementController] delete error:', err);
      res.status(500).json({ success: false, error: 'Failed to delete requirement.' });
    }
  }
};
