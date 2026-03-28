import mongoose from 'mongoose';
import { connectDB } from './config/database';
import { Club, Player, Profile, Auction, Match } from './models';
import { Position, Morale, GAME, AvatarStyle } from '@footlaw/shared';

// Helper to generate random int
const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const MOCK_CLUBS = [
  { name: 'Manchester City', abbr: 'MCI', nationality: 'United Kingdom' },
  { name: 'Real Madrid', abbr: 'RMA', nationality: 'Spain' },
  { name: 'Bayern Munich', abbr: 'BAY', nationality: 'Germany' },
  { name: 'Paris Saint-Germain', abbr: 'PSG', nationality: 'France' },
  { name: 'Inter Milan', abbr: 'INT', nationality: 'Italy' },
  { name: 'Liverpool', abbr: 'LIV', nationality: 'United Kingdom' },
  { name: 'Barcelona', abbr: 'BAR', nationality: 'Spain' },
  { name: 'Arsenal', abbr: 'ARS', nationality: 'United Kingdom' },
  { name: 'Bayer Leverkusen', abbr: 'LEV', nationality: 'Germany' },
  { name: 'AC Milan', abbr: 'ACM', nationality: 'Italy' },
];

const POSITIONS = Object.values(Position);
const WORLD_CLASS_PLAYERS = [
  { fn: 'Erling', ln: 'Haaland', pos: Position.ST, age: 23, rating: 9 },
  { fn: 'Kylian', ln: 'Mbappé', pos: Position.ST, age: 25, rating: 9 },
  { fn: 'Kevin', ln: 'De Bruyne', pos: Position.MC, age: 32, rating: 9 },
  { fn: 'Jude', ln: 'Bellingham', pos: Position.AMC, age: 20, rating: 9 },
  { fn: 'Rodri', ln: 'Hernández', pos: Position.DMC, age: 27, rating: 9 },
  { fn: 'Vinícius', ln: 'Júnior', pos: Position.AML, age: 23, rating: 9 },
  { fn: 'Harry', ln: 'Kane', pos: Position.ST, age: 30, rating: 9 },
  { fn: 'Mohamed', ln: 'Salah', pos: Position.AMR, age: 31, rating: 8 },
  { fn: 'Bernardo', ln: 'Silva', pos: Position.MC, age: 29, rating: 8 },
  { fn: 'Ruben', ln: 'Dias', pos: Position.DC, age: 26, rating: 8 },
  { fn: 'Virgil', ln: 'van Dijk', pos: Position.DC, age: 32, rating: 8 },
  { fn: 'Alisson', ln: 'Becker', pos: Position.GK, age: 31, rating: 8 },
  { fn: 'Thibaut', ln: 'Courtois', pos: Position.GK, age: 31, rating: 8 },
  { fn: 'Luka', ln: 'Modrić', pos: Position.MC, age: 38, rating: 8 },
  { fn: 'Antoine', ln: 'Griezmann', pos: Position.AMC, age: 32, rating: 8 },
  { fn: 'Bukayo', ln: 'Saka', pos: Position.AMR, age: 22, rating: 8 },
  { fn: 'Phil', ln: 'Foden', pos: Position.AMC, age: 23, rating: 8 },
  { fn: 'Bruno', ln: 'Fernandes', pos: Position.MC, age: 29, rating: 8 },
  { fn: 'Federico', ln: 'Valverde', pos: Position.MC, age: 25, rating: 8 },
  { fn: 'Aurelien', ln: 'Tchouameni', pos: Position.DMC, age: 24, rating: 8 },
];

const FIRST_NAMES = [
  'Luka', 'Julian', 'Virgil', 'Trent', 'Marc', 'Frenkie', 'Pedri', 'Gavi',
  'Robert', 'Rodrygo', 'Ederson', 'Marcus'
];
const LAST_NAMES = [
  'Modric', 'Alvarez', 'Van Dijk', 'Alexander-Arnold', 'Guehi', 'De Jong', 
  'Lewandowski', 'Courtois', 'Dias', 'Rashford'
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
        userId: new mongoose.Types.ObjectId(),
        firstName: 'Manager',
        lastName: c.name,
        nationality: c.nationality,
        avatarStyle: AvatarStyle.BUSINESS_SUIT,
      });

      const club = await Club.create({
        profileId: profile._id,
        name: c.name,
        abbreviation: c.abbr,
        cash: 100000000,
        tokens: 1000,
        tier: 1,
      });
      dbClubs.push(club);
      
      // Add some world class players specifically to some clubs
      if (c.name === 'Manchester City') {
         const cityPlayers = WORLD_CLASS_PLAYERS.filter(p => ['Haaland', 'De Bruyne', 'Rodri', 'Foden', 'Dias'].includes(p.ln));
         for (const wp of cityPlayers) {
            await Player.create({
              clubId: club._id,
              firstName: wp.fn,
              lastName: wp.ln,
              age: wp.age,
              position: wp.pos,
              starRating: wp.rating,
              condition: 100,
              morale: Morale.EXCELLENT,
              stats: {
                fitness: 99, strength: 95, pace: 98, aggression: 80,
                positioning: 99, creativity: 99, passing: 99, shooting: 99, tackling: 70, crossing: 95
              }
            });
         }
      }

      await generatePlayersForClub(club._id as mongoose.Types.ObjectId);
    }
    
    console.log('📅 Scheduling initial Fixtures...');
    for (let i = 0; i < dbClubs.length; i++) {
      await Match.create({
        homeClubId: dbClubs[i]._id,
        awayClubId: dbClubs[(i + 1) % dbClubs.length]._id,
        status: 'scheduled',
        competition: 'European Elite',
        matchday: 1,
        date: new Date(Date.now() + 3600000), // 1 hour later
      });
    }

    console.log('🔨 Setting up Live Transfer Market Auctions...');
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
