import mongoose from 'mongoose';
import { connectDB } from './config/database';
import { Club, Player, Profile, Auction } from './models';
import { Position, Morale, GAME, AvatarStyle } from '@footlaw/shared';

// Helper to generate random int
const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const MOCK_CLUBS = [
  { name: 'London FC', abbr: 'LFC' },
  { name: 'Madrid Real', abbr: 'RMA' },
  { name: 'Catalonia', abbr: 'FCB' },
  { name: 'Bavaria', abbr: 'FCB' },
  { name: 'Manchester Red', abbr: 'MUN' },
];

const POSITIONS = Object.values(Position);
const FIRST_NAMES = [
  'Luka', 'Julian', 'Erling', 'Kevin', 'Virgil', 'Trent', 'Alisson', 'Marc', 'Frenkie', 'Pedri', 'Gavi',
  'Robert', 'Kylian', 'Vinicius', 'Jude', 'Rodrygo', 'Thibaut', 'Ruben', 'Ederson', 'Phil', 'Marcus', 'Bruno'
];
const LAST_NAMES = [
  'Modric', 'Alvarez', 'Haaland', 'De Bruyne', 'Van Dijk', 'Alexander-Arnold', 'Becker', 'Guehi', 'De Jong', 
  'Lewandowski', 'Mbappe', 'Junior', 'Bellingham', 'Courtois', 'Dias', 'Foden', 'Rashford', 'Fernandes'
];

async function generatePlayersForClub(clubId: mongoose.Types.ObjectId) {
  const players = [];
  // Generate 15 players per club
  for (let i = 0; i < 15; i++) {
    const fn = FIRST_NAMES[rnd(0, FIRST_NAMES.length - 1)];
    const ln = LAST_NAMES[rnd(0, LAST_NAMES.length - 1)];
    const pos = POSITIONS[rnd(0, POSITIONS.length - 1)];
    const age = rnd(17, 34);
    const starRating = rnd(3, 9);
    
    players.push({
      clubId,
      firstName: fn,
      lastName: ln,
      age,
      position: pos,
      starRating,
      condition: rnd(70, 100),
      morale: Morale.GOOD,
      isYouth: age < 21,
      stats: {
        fitness: rnd(60, 99),
        strength: rnd(60, 99),
        pace: rnd(60, 99),
        aggression: rnd(40, 99),
        positioning: rnd(60, 99),
        creativity: rnd(60, 99),
        passing: rnd(60, 99),
        shooting: rnd(60, 99),
        tackling: rnd(60, 99),
        crossing: rnd(60, 99),
      }
    });
  }
  return Player.insertMany(players);
}

async function seed() {
  try {
    await connectDB();
    console.log('🌱 Connected to database, starting seed...');

    console.log('🧹 Clearing old data...');
    await Club.deleteMany({});
    await Player.deleteMany({});
    await Profile.deleteMany({});
    await Auction.deleteMany({});

    console.log('⚽ Generating Football Clubs...');
    
    const dbClubs = [];

    for (const c of MOCK_CLUBS) {
      // Create a unique profile for each system club
      const profile = await Profile.create({
        userId: new mongoose.Types.ObjectId().toHexString(),
        firstName: 'Manager',
        lastName: c.name,
        nationality: 'GBR',
        avatarStyle: AvatarStyle.TRACKSUIT,
      });

      const club = await Club.create({
        profileId: profile._id,
        name: c.name,
        abbreviation: c.abbr,
        cash: 50000000,
        tokens: 500,
        tier: 1,
      });
      dbClubs.push(club);
      await generatePlayersForClub(club._id as mongoose.Types.ObjectId);
    }
    
    console.log('🔨 Setting up Live Transfer Market Auctions...');
    
    // Pick random players to auction
    const auctionPlayers = await Player.find().limit(15);
    for (const p of auctionPlayers) {
      const startPrice = rnd(1000000, 15000000);
      const endsInMinutes = rnd(5, 120);
      
      await Auction.create({
        playerId: p._id,
        startPrice,
        currentBid: startPrice,
        endTime: new Date(Date.now() + endsInMinutes * 60000),
        status: 'active',
        bids: [],
        sellerId: p.clubId,
      });
    }

    console.log('✅ Seed completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeds failed:', error);
    process.exit(1);
  }
}

seed();
