import Advertisement from '../models/Advertisement.js';
import { isDbConnected } from '../config/db.js';
import { logActivity, memoryActivityLogs } from '../middleware/auth.js';

export const memoryAdvertisements = [
  {
    _id: 'sample_ad_1',
    id: 'sample_ad_1',
    title: 'Admissions Open 2026-27: HS-CIT & AI Skills',
    description:
      'Join our government-certified computer courses, Python with AI, and Advanced Tally. Early bird seats now available.',
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    ctaText: 'Apply For Admission',
    ctaUrl: '/admission/personal-details',
    badge: 'Admission Open',
    status: 'published',
    displayOrder: 1,
    startDate: null,
    endDate: null,
    createdBy: 'Centre Administrator',
    createdAt: new Date(),
  },
];

/**
 * GET /api/advertisements/published
 * Public endpoint for homepage.
 * Returns only published and active advertisements within valid date window.
 */
export async function getPublishedAdvertisements(req, res) {
  try {
    const now = new Date();
    let ads = [];

    if (isDbConnected) {
      try {
        ads = await Advertisement.find({
          status: 'published',
          $and: [
            { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
            { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
          ],
        })
          .sort({ displayOrder: 1, createdAt: -1 })
          .lean();
      } catch (err) {
        console.warn('DB getPublishedAdvertisements error:', err.message);
      }
    }

    if (ads.length === 0 && !isDbConnected) {
      ads = memoryAdvertisements.filter((ad) => {
        if (ad.status !== 'published') return false;
        if (ad.startDate && new Date(ad.startDate) > now) return false;
        if (ad.endDate && new Date(ad.endDate) < now) return false;
        return true;
      });
    }

    return res.status(200).json({
      success: true,
      advertisements: ads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve published advertisements.',
    });
  }
}

/**
 * GET /api/admin/advertisements
 * Admin endpoint: view all advertisements regardless of status
 */
export async function getAllAdvertisements(req, res) {
  try {
    let ads = [];
    if (isDbConnected) {
      try {
        ads = await Advertisement.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
      } catch (err) {
        console.warn('DB getAllAdvertisements error:', err.message);
      }
    }

    if (ads.length === 0 && !isDbConnected) {
      ads = memoryAdvertisements;
    }

    return res.status(200).json({
      success: true,
      advertisements: ads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve advertisements.',
    });
  }
}

/**
 * POST /api/admin/advertisements
 * Admin endpoint: create new advertisement
 */
export async function createAdvertisement(req, res) {
  try {
    const {
      title,
      description,
      imageUrl,
      ctaText,
      ctaUrl,
      badge,
      status,
      startDate,
      endDate,
      displayOrder,
    } = req.body;

    const cleanTitle = (title || '').toString().trim();
    const cleanImg = (imageUrl || '').toString().trim();

    if (!cleanTitle) {
      return res.status(400).json({
        success: false,
        error: 'Advertisement title is required.',
      });
    }

    if (!cleanImg) {
      return res.status(400).json({
        success: false,
        error: 'Advertisement image or banner URL is required.',
      });
    }

    const adData = {
      title: cleanTitle,
      description: (description || '').toString().trim(),
      imageUrl: cleanImg,
      ctaText: (ctaText || 'Learn More').toString().trim(),
      ctaUrl: (ctaUrl || '/courses').toString().trim(),
      badge: (badge || 'Featured Announcement').toString().trim(),
      status: ['draft', 'published', 'scheduled', 'expired'].includes(status)
        ? status
        : 'published',
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      displayOrder: Number(displayOrder) || 0,
      createdBy: req.user?.name || req.admin?.name || 'Administrator',
    };

    let newAd = null;
    if (isDbConnected) {
      newAd = await Advertisement.create(adData);
    } else {
      newAd = {
        _id: `mem_ad_${Date.now()}`,
        id: `mem_ad_${Date.now()}`,
        ...adData,
        createdAt: new Date(),
      };
      memoryAdvertisements.unshift(newAd);
    }

    await logActivity({
      action: 'ADVERTISEMENT_CREATED',
      category: 'advertisement',
      description: `New advertisement "${cleanTitle}" created by ${adData.createdBy}.`,
      targetId: String(newAd._id || newAd.id),
      req,
    });

    return res.status(201).json({
      success: true,
      message: 'Advertisement created successfully.',
      advertisement: newAd,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create advertisement.',
    });
  }
}

/**
 * PUT /api/admin/advertisements/:id
 * Admin endpoint: update existing advertisement
 */
export async function updateAdvertisement(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      imageUrl,
      ctaText,
      ctaUrl,
      badge,
      status,
      startDate,
      endDate,
      displayOrder,
    } = req.body;

    let ad = null;
    if (isDbConnected) {
      ad = await Advertisement.findById(id);
    } else {
      ad = memoryAdvertisements.find((a) => (a._id || a.id) === id);
    }

    if (!ad) {
      return res.status(404).json({ success: false, error: 'Advertisement not found.' });
    }

    if (title !== undefined) ad.title = title.trim();
    if (description !== undefined) ad.description = description.trim();
    if (imageUrl !== undefined) ad.imageUrl = imageUrl.trim();
    if (ctaText !== undefined) ad.ctaText = ctaText.trim();
    if (ctaUrl !== undefined) ad.ctaUrl = ctaUrl.trim();
    if (badge !== undefined) ad.badge = badge.trim();
    if (status !== undefined) ad.status = status;
    if (startDate !== undefined) ad.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) ad.endDate = endDate ? new Date(endDate) : null;
    if (displayOrder !== undefined) ad.displayOrder = Number(displayOrder);

    if (isDbConnected && ad.save) {
      await ad.save();
    }

    await logActivity({
      action: 'ADVERTISEMENT_UPDATED',
      category: 'advertisement',
      description: `Advertisement "${ad.title}" updated.`,
      targetId: id,
      req,
    });

    return res.status(200).json({
      success: true,
      message: 'Advertisement updated successfully.',
      advertisement: ad,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update advertisement.',
    });
  }
}

/**
 * DELETE /api/admin/advertisements/:id
 * Admin endpoint: delete advertisement
 */
export async function deleteAdvertisement(req, res) {
  try {
    const { id } = req.params;
    let ad = null;

    if (isDbConnected) {
      ad = await Advertisement.findByIdAndDelete(id);
    } else {
      const idx = memoryAdvertisements.findIndex((a) => (a._id || a.id) === id);
      if (idx !== -1) {
        ad = memoryAdvertisements[idx];
        memoryAdvertisements.splice(idx, 1);
      }
    }

    if (!ad) {
      return res.status(404).json({ success: false, error: 'Advertisement not found.' });
    }

    await logActivity({
      action: 'ADVERTISEMENT_DELETED',
      category: 'advertisement',
      description: `Advertisement "${ad.title}" was deleted.`,
      targetId: id,
      req,
    });

    return res.status(200).json({
      success: true,
      message: 'Advertisement deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete advertisement.',
    });
  }
}
