import { Router, type Response } from 'express';
import { authMiddleware, type AuthRequest } from '../middleware/auth';
import { Profile, Club, Tactic } from '../models';

const router = Router();

// ---- GET /api/tactics/mine ----
// Get the current user's club tactic

router.get('/mine', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      res.status(404).json({ success: false, error: 'Profile not found' });
      return;
    }

    const club = await Club.findOne({ profileId: profile._id });
    if (!club) {
      res.status(404).json({ success: false, error: 'Club not found' });
      return;
    }

    const tactic = await Tactic.findOne({ clubId: club._id })
      .populate('startingEleven')
      .populate('substitutes');

    if (!tactic) {
      res.status(404).json({ success: false, error: 'Tactic not found' });
      return;
    }

    res.json({
      success: true,
      data: tactic,
    });
  } catch (error) {
    console.error('Get tactic error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ---- PUT /api/tactics/mine ----
// Update the current user's tactic

router.put('/mine', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { formation, mentality, passingStyle, startingEleven, substitutes } = req.body;

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      res.status(404).json({ success: false, error: 'Profile not found' });
      return;
    }

    const club = await Club.findOne({ profileId: profile._id });
    if (!club) {
      res.status(404).json({ success: false, error: 'Club not found' });
      return;
    }

    const tactic = await Tactic.findOneAndUpdate(
      { clubId: club._id },
      {
        formation,
        mentality,
        passingStyle,
        startingEleven,
        substitutes
      },
      { new: true, runValidators: true }
    )
      .populate('startingEleven')
      .populate('substitutes');

    if (!tactic) {
      res.status(404).json({ success: false, error: 'Tactic not found' });
      return;
    }

    res.json({
      success: true,
      data: tactic,
    });
  } catch (error: any) {
    console.error('Update tactic error:', error);
    res.status(400).json({ success: false, error: error.message || 'Invalid tactic data' });
  }
});

export default router;
