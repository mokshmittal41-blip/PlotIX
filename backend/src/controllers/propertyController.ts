import { Request, Response } from 'express';
import { propertyStore, PropertyEntity } from '../db/propertyStore';
import { supabaseAdmin } from '../config/supabase';
import { env } from '../config/env';

export const propertyController = {
  /**
   * GET /api/properties
   * Public endpoint to explore and filter properties
   */
  async listProperties(req: Request, res: Response): Promise<void> {
    try {
      const {
        city,
        district,
        state,
        type,
        listingType,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
        facing,
        verifiedOnly,
        search,
        sortBy,
        page,
        limit
      } = req.query;

      const filters = {
        city: city as string | undefined,
        district: district as string | undefined,
        state: state as string | undefined,
        type: type as string | string[] | undefined,
        listingType: listingType as string | undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        minArea: minArea ? parseFloat(minArea as string) : undefined,
        maxArea: maxArea ? parseFloat(maxArea as string) : undefined,
        facing: facing as string | undefined,
        verifiedOnly: verifiedOnly === 'true' || verifiedOnly === '1',
        search: search as string | undefined,
        sortBy: sortBy as any,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 12,
        includeNonActive: false
      };

      const result = await propertyStore.queryProperties(filters);

      // Instant response to user (< 5ms).
      res.status(200).json({
        success: true,
        data: result.properties,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      });

      // Background dynamic ingestion: If results are scarce (< 4 items) for a specific requested city/state/search,
      // trigger background ingestion asynchronously (fire-and-forget) so subsequent queries have more data.
      const queryCity = filters.city || filters.district || filters.search;
      if (result.total < 4 && queryCity && queryCity !== 'All' && queryCity !== 'All India') {
        setImmediate(async () => {
          try {
            const { externalListingService } = await import('../services/externalListingService');
            await externalListingService.fetchAndIngestOnDemand(
              queryCity,
              filters.state
            );
          } catch (e: any) {
            // Background log only, never blocks response
          }
        });
      }
    } catch (err: any) {
      console.error('[PropertyController] listProperties error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch property listings. Please try again later.'
        });
      }
    }
  },

  /**
   * GET /api/properties/:id
   * Public endpoint to view a specific property detail (Instant O(1) response)
   */
  async getPropertyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: 'Property ID is required.' });
        return;
      }

      const property = await propertyStore.getPropertyById(id);

      if (!property || property.status === 'deleted') {
        res.status(404).json({ success: false, error: 'Property listing not found or has been removed.' });
        return;
      }

      // Fetch up to 3 similar active listings in the same city or district (instant from in-memory cache)
      let similar: PropertyEntity[] = [];
      try {
        const similarRes = await propertyStore.queryProperties({
          city: property.city,
          district: property.district,
          limit: 4,
          includeNonActive: false
        });
        similar = similarRes.properties.filter(p => p.id !== property.id).slice(0, 3);
      } catch {}

      res.status(200).json({
        success: true,
        data: property,
        similar
      });
    } catch (err: any) {
      console.error('[PropertyController] getPropertyById error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Failed to retrieve property details.'
        });
      }
    }
  },

  /**
   * POST /api/properties
   * Protected endpoint for users, owners, brokers, and agents to post a listing
   * Listing is immediately published live (status = 'active') without admin delays
   */
  async createProperty(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || null;
      const body = req.body;

      // Extract and sanitize input fields (supporting camelCase or snake_case)
      const title = (body.title || '').trim();
      const propertyType = (body.property_type || body.propertyType || '').trim();
      const listingType = (body.listing_type || body.listingType || 'sale').trim().toLowerCase();
      const rawPrice = body.price;
      const rawArea = body.area;
      const areaUnit = (body.area_unit || body.areaUnit || 'sq.yd.').trim();
      const city = (body.city || '').trim();
      const district = (body.district || city || 'Rewari').trim();
      const state = (body.state || 'Haryana').trim();
      const contactName = (body.contact_name || body.contactName || req.user?.user_metadata?.full_name || req.user?.email?.split('@')[0] || 'Property Owner').trim();
      const contactPhone = (body.contact_phone || body.contactPhone || req.user?.phone || req.user?.user_metadata?.phone || '').trim();

      // Validation
      if (!title || title.length < 3) {
        res.status(400).json({ success: false, error: 'Property title must be at least 3 characters.' });
        return;
      }

      if (!propertyType) {
        res.status(400).json({ success: false, error: 'Property type is required.' });
        return;
      }

      const price = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice).replace(/[^\d.]/g, ''));
      if (isNaN(price) || price <= 0) {
        res.status(400).json({ success: false, error: 'Please enter a valid price amount.' });
        return;
      }

      const area = typeof rawArea === 'number' ? rawArea : parseFloat(String(rawArea).replace(/[^\d.]/g, ''));
      if (isNaN(area) || area <= 0) {
        res.status(400).json({ success: false, error: 'Please enter a valid area size.' });
        return;
      }

      if (!city) {
        res.status(400).json({ success: false, error: 'City is required.' });
        return;
      }

      if (!contactPhone) {
        res.status(400).json({ success: false, error: 'Contact phone number is required so buyers can connect with you.' });
        return;
      }

      // Calculate price per unit
      const pricePerUnit = Math.round(price / area);

      const propertyData: Omit<PropertyEntity, 'id' | 'created_at' | 'updated_at' | 'views_count'> = {
        user_id: userId,
        title,
        description: body.description || '',
        property_type: propertyType,
        listing_type: listingType as any,
        price,
        price_unit: body.price_unit || body.priceUnit || 'total',
        price_per_unit: body.price_per_unit || body.pricePerUnit || pricePerUnit,
        area,
        area_unit: areaUnit,
        address: body.address || '',
        locality: body.locality || body.tehsil || city,
        sector: body.sector || '',
        tehsil: body.tehsil || '',
        city,
        district,
        state,
        pincode: body.pincode || '',
        latitude: body.latitude ? parseFloat(body.latitude) : undefined,
        longitude: body.longitude ? parseFloat(body.longitude) : undefined,
        facing: body.facing || 'East',
        road_width_ft: body.road_width_ft ? parseFloat(body.road_width_ft) : undefined,
        khasra_no: body.khasra_no || body.khasraNo || '',
        registry_status: body.registry_status || body.registryStatus || 'Clear Registry Verified',
        is_verified: true,
        status: 'active', // Immediately published live
        images: Array.isArray(body.images) ? body.images : [],
        amenities: Array.isArray(body.amenities) ? body.amenities : [],
        approvals: Array.isArray(body.approvals) ? body.approvals : ['Registry Verified'],
        nearby_landmarks: Array.isArray(body.nearby_landmarks || body.nearbyLandmarks) ? (body.nearby_landmarks || body.nearbyLandmarks) : [],
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_email: body.contact_email || body.contactEmail || req.user?.email || '',
        agency_name: body.agency_name || body.agencyName || '',
        source: body.source || (body.agencyName ? 'broker' : 'direct_listing')
      };

      const result = await propertyStore.createProperty(propertyData);

      if (!result.success || !result.property) {
        res.status(400).json({ success: false, error: result.error || 'Failed to create listing.' });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Property published and visible in Explore Properties immediately!',
        data: result.property
      });
    } catch (err: any) {
      console.error('[PropertyController] createProperty error:', err);
      res.status(500).json({
        success: false,
        error: `Failed to publish property: ${err.message || 'Unknown error'}`
      });
    }
  },

  /**
   * PUT /api/properties/:id
   * Protected endpoint for owners to edit their listings or update status (e.g. mark sold)
   */
  async updateProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!id) {
        res.status(400).json({ success: false, error: 'Property ID is required.' });
        return;
      }

      if (!userId) {
        res.status(401).json({ success: false, error: 'Authentication required.' });
        return;
      }

      const body = req.body;
      const updates: Partial<PropertyEntity> = {};

      if (body.title) updates.title = body.title.trim();
      if (body.description !== undefined) updates.description = body.description;
      if (body.property_type || body.propertyType) updates.property_type = body.property_type || body.propertyType;
      if (body.listing_type || body.listingType) updates.listing_type = body.listing_type || body.listingType;
      if (body.price !== undefined) updates.price = parseFloat(body.price);
      if (body.area !== undefined) updates.area = parseFloat(body.area);
      if (body.area_unit || body.areaUnit) updates.area_unit = body.area_unit || body.areaUnit;
      if (body.locality) updates.locality = body.locality;
      if (body.city) updates.city = body.city;
      if (body.district) updates.district = body.district;
      if (body.state) updates.state = body.state;
      if (body.facing) updates.facing = body.facing;
      if (body.road_width_ft !== undefined) updates.road_width_ft = parseFloat(body.road_width_ft);
      if (body.khasra_no !== undefined) updates.khasra_no = body.khasra_no;
      if (body.registry_status) updates.registry_status = body.registry_status;
      if (body.status) updates.status = body.status; // 'active', 'sold', 'rented', 'expired', 'deleted'
      if (Array.isArray(body.images)) updates.images = body.images;
      if (body.contact_name || body.contactName) updates.contact_name = body.contact_name || body.contactName;
      if (body.contact_phone || body.contactPhone) updates.contact_phone = body.contact_phone || body.contactPhone;
      if (body.agency_name || body.agencyName) updates.agency_name = body.agency_name || body.agencyName;

      const result = await propertyStore.updateProperty(id, updates, userId);

      if (!result.success) {
        res.status(400).json({ success: false, error: result.error || 'Failed to update property.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Property updated successfully.',
        data: result.property
      });
    } catch (err: any) {
      console.error('[PropertyController] updateProperty error:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to update property listing.'
      });
    }
  },

  /**
   * DELETE /api/properties/:id
   * Protected endpoint for owner to remove their listing
   */
  async deleteProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!id) {
        res.status(400).json({ success: false, error: 'Property ID is required.' });
        return;
      }

      if (!userId) {
        res.status(401).json({ success: false, error: 'Authentication required.' });
        return;
      }

      const result = await propertyStore.deleteProperty(id, userId);

      if (!result.success) {
        res.status(400).json({ success: false, error: result.error || 'Failed to delete property.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Property removed successfully.'
      });
    } catch (err: any) {
      console.error('[PropertyController] deleteProperty error:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to delete property listing.'
      });
    }
  },

  /**
   * GET /api/properties/user/my-listings
   * Protected endpoint to get all listings belonging to current authenticated user
   */
  async getMyListings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Authentication required.' });
        return;
      }

      const result = await propertyStore.queryProperties({
        userId,
        includeNonActive: true,
        limit: 100
      });

      res.status(200).json({
        success: true,
        data: result.properties,
        total: result.total
      });
    } catch (err: any) {
      console.error('[PropertyController] getMyListings error:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch your properties.'
      });
    }
  },

  /**
   * POST /api/properties/upload-image
   * Protected endpoint to upload property images to Supabase Storage bucket 'property-images'
   */
  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Authentication required.' });
        return;
      }

      const { dataBase64, fileName, contentType } = req.body;

      if (!dataBase64) {
        res.status(400).json({ success: false, error: 'Image base64 data is required.' });
        return;
      }

      if (!supabaseAdmin) {
        // Fallback for local testing: return data URI or mock URL
        res.status(200).json({
          success: true,
          url: dataBase64.startsWith('data:') ? dataBase64 : `data:${contentType || 'image/jpeg'};base64,${dataBase64}`
        });
        return;
      }

      // Clean base64 string
      const matches = dataBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const mime = matches ? matches[1] : (contentType || 'image/jpeg');
      const buffer = Buffer.from(matches ? matches[2] : dataBase64, 'base64');

      const ext = mime.split('/')[1] || 'jpg';
      const cleanFileName = (fileName || 'property-image').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filePath = `properties/${userId}/${Date.now()}_${cleanFileName}.${ext}`;

      const { data, error } = await supabaseAdmin.storage
        .from('property-images')
        .upload(filePath, buffer, {
          contentType: mime,
          upsert: true
        });

      if (error) {
        console.warn('[PropertyController] Supabase Storage upload error:', error);
        // If bucket upload fails, return base64 as fallback so user experience is not disrupted
        res.status(200).json({
          success: true,
          url: dataBase64.startsWith('data:') ? dataBase64 : `data:${mime};base64,${dataBase64}`
        });
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabaseAdmin.storage
        .from('property-images')
        .getPublicUrl(filePath);

      res.status(200).json({
        success: true,
        url: publicUrlData.publicUrl,
        filePath
      });
    } catch (err: any) {
      console.error('[PropertyController] uploadImage error:', err);
      res.status(500).json({
        success: false,
        error: `Failed to upload image: ${err.message || 'Unknown error'}`
      });
    }
  },

  /**
   * POST /api/properties/sync
   * Trigger external listing ingestion and synchronization
   */
  async syncExternalListings(req: Request, res: Response): Promise<void> {
    try {
      const { city, state } = req.body;
      const { externalListingService } = await import('../services/externalListingService');

      if (city && typeof city === 'string') {
        const result = await externalListingService.syncCityListings(city, state);
        res.status(200).json({
          success: true,
          message: `Synchronized ${result.totalFound} listings for ${city}: ${result.inserted} inserted, ${result.updated} updated, ${result.skipped} skipped, ${result.failed} failed.`,
          data: result
        });
      } else {
        const results = await externalListingService.syncAllActiveCities();
        const totalFound = results.reduce((acc, r) => acc + r.totalFound, 0);
        const totalInserted = results.reduce((acc, r) => acc + r.inserted, 0);
        const totalUpdated = results.reduce((acc, r) => acc + r.updated, 0);
        const totalSkipped = results.reduce((acc, r) => acc + r.skipped, 0);
        res.status(200).json({
          success: true,
          message: `Completed synchronization across ${results.length} cities (${totalFound} found, ${totalInserted} inserted, ${totalUpdated} updated, ${totalSkipped} skipped).`,
          data: results
        });
      }
    } catch (err: any) {
      console.error('[PropertyController] syncExternalListings error:', err);
      res.status(500).json({
        success: false,
        error: `Sync failed: ${err.message || 'Unknown error'}`
      });
    }
  },

  /**
   * GET /api/properties/sync/status
   * Get sync status, provider health, and schedule information
   */
  async getSyncStatus(req: Request, res: Response): Promise<void> {
    try {
      const { externalListingService } = await import('../services/externalListingService');
      const status = externalListingService.getSyncStatus();
      res.status(200).json({
        success: true,
        data: status
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to retrieve sync status.' });
    }
  }
};
