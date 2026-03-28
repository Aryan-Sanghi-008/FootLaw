import { Router, type Response } from 'express';
import { authMiddleware, type AuthRequest } from '../middleware/auth';
import { Club, Profile } from '../models';

const router = Router();

// Get world tour progress
router.get('/progress', authMiddleware, async (req: AuthRequest, res: Response) => {
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
    
    // Initialize regions if not exists
    if (!club.worldTourProgress || club.worldTourProgress.length === 0) {
      club.worldTourProgress = [
        { regionId: 'eu', completedMatches: 0 },
        { regionId: 'na', completedMatches: 0 },
        { regionId: 'sa', completedMatches: 0 },
        { regionId: 'as', completedMatches: 0 },
      ];
      await club.save();
    }

    res.json({ success: true, data: club.worldTourProgress });
  } catch (error) {
    console.error('Fetch tour progress error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update progress (called after a tour match win)
router.post('/complete-match', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { regionId } = req.body;

    const profile = await Profile.findOne({ userId });
    const club = await Club.findOne({ profileId: profile?._id });

    if (!club) {
      res.status(404).json({ success: false, error: 'Club not found' });
      return;
    }

    const region = club.worldTourProgress.find(r => r.regionId === regionId);
    if (!region) {
      res.status(400).json({ success: false, error: 'Invalid region' });
      return;
    }

    region.completedMatches += 1;
    
    // Reward for completing a match: $500K + 5 Tokens
    club.cash += 500000;
    club.tokens += 5;
    
    await club.save();
    res.json({ 
      success: true, 
      data: { 
        progress: club.worldTourProgress, 
        cash: club.cash, 
        tokens: club.tokens 
      } 
    });
  } catch (error) {
    console.error('Complete tour match error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
