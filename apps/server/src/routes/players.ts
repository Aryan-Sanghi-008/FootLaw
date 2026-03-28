import { Router, type Response } from 'express';
import { authMiddleware, type AuthRequest } from '../middleware/auth';
import { Profile, Club, Player } from '../models';

const router = Router();

// ---- GET /api/players/squad ----
// Get all players for the current user's club

router.get('/squad', authMiddleware, async (req: AuthRequest, res: Response) => {
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

    const players = await Player.find({ clubId: club._id }).sort({ starRating: -1, position: 1 });

    res.json({
      success: true,
      data: {
        clubId: club._id,
        clubName: club.name,
        players,
      },
    });
  } catch (error) {
    console.error('Get squad error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ---- GET /api/players/:playerId ----
// Get a specific player's full details

router.get('/:playerId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { playerId } = req.params;
    const player = await Player.findById(playerId);

    if (!player) {
      res.status(404).json({ success: false, error: 'Player not found' });
      return;
    }

    res.json({
      success: true,
      data: player,
    });
  } catch (error) {
    console.error('Get player error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
