# ⚽ Footlaw: Football Management Simulation

Footlaw is a persistent, real-time football management simulation game for Android and iOS. Build your club from the ground up, scout world-class talent, and dominate the league.

## 🏗️ Project Structure

This is a **Turborepo** monorepo:

- `apps/mobile`: React Native (Expo) - The mobile game client.
- `apps/server`: Node.js (Express) - Backend API and real-time Socket.IO server.
- `packages/shared`: Shared TypeScript types, constants, and game logic utilities.

## 🧪 Tech Stack

- **Frontend**: React Native, Expo Router, Redux Toolkit, Socket.IO Client.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.IO.
- **Shared**: TypeScript (Strict mode).
- **Database**: MongoDB (Persistence), Redis (Caching/Sessions).

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have the following installed (via Homebrew on macOS):

```bash
brew install colima docker docker-compose docker-buildx
```

### 2. Infrastructure Setup (Colima & Docker Compose)

To start the local MongoDB and Redis services using **Colima**:

1.  **Start Colima** (if not already running):
    ```bash
    colima start --cpu 2 --memory 4
    ```

2.  **Launch Infrastructure**:
    Use Docker Compose to start MongoDB and Redis with persistent volumes:
    ```bash
    docker-compose up -d
    ```

3.  **Verify Services**:
    ```bash
    docker ps
    ```
    You should see both `footlaw-mongodb` and `footlaw-redis` containers running.

### 3. Installation

From the root directory, install all dependencies for the entire monorepo:

```bash
npm install
```

### 4. Environment Variables

The server requires environment variables. A default `.env` is provided in `apps/server/.env`. Ensure the values match your local setup.

---

## 🏃 Running the Application

### Everything at once (Recommended)

Run both the server and the mobile app in development mode using Turbo:

```bash
npm run dev
```

### Running individual apps

- **Server only**: `npm run dev --filter=@footlaw/server`
- **Mobile only**: `npm run dev --filter=@footlaw/mobile`

### Mobile Development Details

When running the mobile app:
- Press `i` to open the **iOS Simulator**.
- Press `a` to open the **Android Emulator**.
- Scan the **QR Code** with the **Expo Go** app (available on App Store/Play Store) to run on your physical device.

---

## 🛠️ Development Tasks

- **Check Types**: `npm run check-types`
- **Build All**: `npm run build`
- **Format Code**: `npm run format`

## 🛤️ Roadmap

- [x] Phase 1: Foundation, Onboarding, and Squad Genesis.
- [ ] Phase 2: Match Engine (2D Pitch, Real-time Simulation).
- [ ] Phase 3: League System & Season Progression.
- [ ] Phase 4: Transfer Market & Auction House.
- [ ] Phase 5: Campus & Facilities.
