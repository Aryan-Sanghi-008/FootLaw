import { Router, type Response } from 'express';
import { authMiddleware, type AuthRequest } from '../middleware/auth';
import { User, Profile, Club } from '../models';
import { generateStarterSquad } from '../services/playerGenerator';
import { AvatarStyle } from '@footlaw/shared';

const router = Router();

// ---- POST /api/clubs/create ----
// Creates profile + club + seeds starter squad (Contract completion)

router.post('/create', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { clubName, abbreviation, nationality, avatarStyle, managerFirstName, managerLastName } =
      req.body;

    // Validation
    if (!clubName || !abbreviation || !nationality || !managerFirstName || !managerLastName) {
      res.status(400).json({
        success: false,
        error: 'All fields are required: clubName, abbreviation, nationality, managerFirstName, managerLastName',
      });
      return;
    }

    if (clubName.length > 20) {
      res.status(400).json({ success: false, error: 'Club name must be 20 characters or less' });
      return;
    }

    if (!/^[A-Z]{3}$/.test(abbreviation)) {
      res.status(400).json({ success: false, error: 'Abbreviation must be exactly 3 uppercase letters' });
      return;
    }

    // Check if user already has a club
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      const existingClub = await Club.findOne({ profileId: existingProfile._id });
      if (existingClub) {
        res.status(409).json({ success: false, error: 'You already have a club' });
        return;
      }
    }

    // Create profile
    const profile = await Profile.create({
      userId,
      firstName: managerFirstName.trim(),
      lastName: managerLastName.trim(),
      nationality,
      avatarStyle: avatarStyle || AvatarStyle.TRACKSUIT,
    });

    // Create club
    const club = await Club.create({
      profileId: profile._id,
      name: clubName.trim(),
      abbreviation: abbreviation.toUpperCase(),
    });

    // Generate starter squad
    await generateStarterSquad(club._id as any);

    // Mark user profile as completed
    await User.findByIdAndUpdate(userId, { profileCompleted: true });

    res.status(201).json({
      success: true,
      data: {
        profile: {
          id: profile._id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          nationality: profile.nationality,
          avatarStyle: profile.avatarStyle,
        },
        club: {
          id: club._id,
          name: club.name,
          abbreviation: club.abbreviation,
          cash: club.cash,
          tokens: club.tokens,
        },
      },
    });
  } catch (error) {
    console.error('Create club error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ---- GET /api/clubs/mine ----
// Get the current user's club with profile

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

    res.json({
      success: true,
      data: { profile, club },
    });
  } catch (error) {
    console.error('Get club error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ---- POST /api/clubs/facilities/upgrade ----
// Upgrades a specific facility (stadium, medicalCenter, trainingGround, etc.)

router.post('/facilities/upgrade', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { facility } = req.body; // e.g., 'stadium', 'medicalCenter'

    if (!facility) {
      res.status(400).json({ success: false, error: 'Facility type is required' });
      return;
    }

    const profile = await Profile.findOne({ userId });
    const club = await Club.findOne({ profileId: profile?._id });

    if (!club) {
      res.status(404).json({ success: false, error: 'Club not found' });
      return;
    }

    const facilities = club.facilities as any;
    if (!facilities[facility]) {
      res.status(400).json({ success: false, error: 'Invalid facility type' });
      return;
    }

    const currentLevel = facilities[facility].level;
    const upgradeCost = currentLevel * 1000000; // Example: $1M per level

    if (club.cash < upgradeCost) {
      res.status(400).json({ success: false, error: 'Insufficient cash' });
      return;
    }

    // Perform upgrade
    club.cash -= upgradeCost;
    facilities[facility].level += 1;
    
    // Special case for stadium capacity
    if (facility === 'stadium') {
      facilities.stadium.capacity += 1000;
    }

    club.markModified('facilities');
    await club.save();

    res.json({
      success: true,
      data: {
        cash: club.cash,
        facilities: club.facilities,
      },
    });
  } catch (error) {
    console.error('Upgrade facility error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
