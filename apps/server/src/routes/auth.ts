import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User, Profile } from '../models'; // Import Profile
import { config } from '../config';
import { authMiddleware, type AuthRequest } from '../middleware/auth';

const googleClient = new OAuth2Client(config.googleClientId);

const router = Router();

// ---- Helper: Generate tokens ----

function generateTokens(userId: string) {
  const accessToken = jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as any,
  });
  const refreshToken = jwt.sign({ userId }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn as any,
  });
  return { accessToken, refreshToken };
}

// ---- POST /api/auth/register ----

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, nationality } = req.body;

    if (!email || !password || !firstName || !lastName || !nationality) {
      res.status(400).json({ success: false, error: 'All fields are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ success: false, error: 'Email already registered' });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      profileCompleted: false, // Must complete onboarding next
    });

    const profile = await Profile.create({
      userId: user._id,
      firstName,
      lastName,
      nationality,
    });

    const tokens = generateTokens(user._id.toString());

    res.status(201).json({
      success: true,
      data: {
        userId: user._id,
        email: user.email,
        profileCompleted: user.profileCompleted,
        profile,
        ...tokens,
      },
    });
  } catch (error: any) {
    console.error('Register detailed error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error',
      details: error.errors // Validation errors if any
    });
  }
});

// ---- POST /api/auth/login ----

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const tokens = generateTokens(user._id.toString());

    res.json({
      success: true,
      data: {
        userId: user._id,
        email: user.email,
        profileCompleted: user.profileCompleted,
        ...tokens,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ---- POST /api/auth/google ----

router.post('/google', async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ success: false, error: 'Google ID token required' });
      return;
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ success: false, error: 'Invalid Google token' });
      return;
    }

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user for Google login (password-less)
      user = await User.create({
        email,
        password: Math.random().toString(36).slice(-10), // Random placeholder
        profileCompleted: false,
      });

      // Also create a basic profile for the new Google user
      await Profile.create({
        userId: user._id,
        firstName: payload.given_name || 'Manager',
        lastName: payload.family_name || 'Footlaw',
        nationality: 'Global', // Default for Google SSO
      });
    }

    const tokens = generateTokens(user._id.toString());

    res.json({
      success: true,
      data: {
        userId: user._id,
        email: user.email,
        profileCompleted: user.profileCompleted,
        ...tokens,
      },
    });
  } catch (error: any) {
    console.error('Google auth detailed error:', error);
    res.status(401).json({ 
      success: false, 
      error: error.message || 'Google authentication failed' 
    });
  }
});

// ---- POST /api/auth/refresh ----

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ success: false, error: 'Refresh token required' });
      return;
    }

    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid refresh token' });
      return;
    }

    const tokens = generateTokens(user._id.toString());

    res.json({
      success: true,
      data: {
        userId: user._id,
        ...tokens,
      },
    });
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
  }
});

// ---- GET /api/auth/me ----

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
