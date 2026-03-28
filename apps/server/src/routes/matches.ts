import { Router, type Response } from 'express';
import { authMiddleware, type AuthRequest } from '../middleware/auth';
import { Match, Club, Player, Profile } from '../models';

const router = Router();

// ---- GET /api/matches/next ----
// Fetches the upcoming match for the user

router.get('/next', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const profile = await Profile.findOne({ userId });
    const club = await Club.findOne({ profileId: profile?._id });

    if (!club) {
      res.status(404).json({ success: false, error: 'Club not found' });
      return;
    }

    // Find the nearest upcoming match
    const match = await Match.findOne({
      $or: [{ homeClubId: club._id }, { awayClubId: club._id }],
      status: 'scheduled',
    }).sort({ date: 1 });

    if (!match) {
        // If no match found, create a dummy world tour match for now
        const opponent = await Club.findOne({ name: 'Real Madrid' });
        if (opponent && opponent._id.toString() !== club._id.toString()) {
            const nextMatch = await Match.create({
                homeClubId: club._id,
                awayClubId: opponent._id,
                status: 'scheduled',
                competition: 'European Elite',
                matchday: 1,
                date: new Date(Date.now() + 3600000), // 1 hour later
            });
            return res.json({ success: true, data: nextMatch });
        }
    }

    res.json({
      success: true,
      data: match,
    });
  } catch (error) {
    console.error('Fetch next match error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ---- POST /api/matches/:id/simulate ----
// Simulates a match and returns the event log (Top Eleven style)

router.post('/:id/simulate', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const matchId = req.params.id;

    const profile = await Profile.findOne({ userId });
    const club = await Club.findOne({ profileId: profile?._id });

    if (!club) {
      res.status(404).json({ success: false, error: 'Club not found' });
      return;
    }

    const match = await Match.findById(matchId);
    if (!match || match.status !== 'scheduled') {
      res.status(400).json({ success: false, error: 'Match not eligible for simulation' });
      return;
    }

    console.log(`⚽ Simulating match: ${matchId}`);

    // Simple simulation logic: 
    // This is a basic version, real logic would use player stats
    const events = [];
    let homeScore = 0;
    let awayScore = 0;

    // Simulate 90 minutes
    for (let min = 1; min <= 90; min++) {
      const chance = Math.random();
      
      if (chance < 0.03) { // 3% chance of a goal every minute
        const isHomeGoal = Math.random() > 0.45; // 55% home advantage
        if (isHomeGoal) homeScore++; else awayScore++;
        
        events.push({
          minute: min,
          type: 'goal',
          clubId: isHomeGoal ? match.homeClubId : match.awayClubId,
          text: `GOAL! ${isHomeGoal ? 'Home' : 'Away'} team scores in the ${min}th minute!`,
        });
      } else if (chance < 0.06) { // 3% chance of a card
        events.push({
          minute: min,
          type: 'yellow_card',
          clubId: Math.random() > 0.5 ? match.homeClubId : match.awayClubId,
          text: `Yellow card issued at minute ${min}.`,
        });
      }
    }

    // Finalize match
    match.homeScore = homeScore;
    match.awayScore = awayScore;
    match.status = 'completed';
    match.events = events as any;
    match.stats = {
        homePossession: 55,
        awayPossession: 45,
        homeShots: homeScore + 5,
        awayShots: awayScore + 3,
        homeShotsOnTarget: homeScore + 2,
        awayShotsOnTarget: awayScore + 1,
    };
    
    await match.save();

    res.json({
      success: true,
      data: match,
    });
  } catch (error) {
    console.error('Match simulation error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
