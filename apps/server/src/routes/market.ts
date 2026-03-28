import { Router, type Response } from 'express';
import { authMiddleware, type AuthRequest } from '../middleware/auth';
import { Auction, Player, Club, Profile } from '../models';

const router = Router();

// ---- GET /api/market/auctions/live ----
// Fetches all active auctions with player details

router.get('/auctions/live', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const auctions = await Auction.find({ status: 'active' })
      .populate({
        path: 'playerId',
        select: 'firstName lastName age position starRating stats condition morale',
      })
      .sort({ endTime: 1 });

    res.json({
      success: true,
      data: auctions,
    });
  } catch (error) {
    console.error('Fetch live auctions error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ---- POST /api/market/auctions/:id/bid ----
// Places a bid on an auction

router.post('/auctions/:id/bid', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const auctionId = req.params.id;
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      res.status(400).json({ success: false, error: 'Valid bid amount is required' });
      return;
    }

    const profile = await Profile.findOne({ userId });
    const club = await Club.findOne({ profileId: profile?._id });

    if (!club) {
      res.status(404).json({ success: false, error: 'Club not found' });
      return;
    }

    const auction = await Auction.findById(auctionId);
    if (!auction || auction.status !== 'active') {
      res.status(404).json({ success: false, error: 'Auction not active' });
      return;
    }

    if (new Date() > auction.endTime) {
      auction.status = 'completed';
      await auction.save();
      res.status(400).json({ success: false, error: 'Auction has ended' });
      return;
    }

    if (amount <= auction.currentBid) {
      res.status(400).json({ success: false, error: 'Bid must be higher than current bid' });
      return;
    }

    if (club.cash < amount) {
      res.status(400).json({ success: false, error: 'Insufficient cash' });
      return;
    }

    // Place bid
    auction.currentBid = amount;
    auction.highestBidderId = club._id as any;
    auction.bids.push({
      clubId: club._id as any,
      amount,
      createdAt: new Date(),
    });

    // Extend auction by 30s if bid is in last minute (Top Eleven style)
    const timeRemaining = auction.endTime.getTime() - Date.now();
    if (timeRemaining < 60000) {
      auction.endTime = new Date(auction.endTime.getTime() + 30000);
    }

    await auction.save();

    res.json({
      success: true,
      data: auction,
    });
  } catch (error) {
    console.error('Bid error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ---- GET /api/market/scouts/elite ----
// Generates/Fetches elite scouting prospects

router.get('/scouts/elite', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // For now, return highly rated players not owned by the user
    // In a real app, this might use a procedural generator
    const elitePlayers = await Player.find({ 
      starRating: { $gte: 7 } 
    }).limit(5);

    res.json({
      success: true,
      data: elitePlayers,
    });
  } catch (error) {
    console.error('Fetch elite scouts error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
