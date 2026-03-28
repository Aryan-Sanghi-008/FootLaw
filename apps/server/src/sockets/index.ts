import { Server as SocketIOServer, type Socket } from 'socket.io';
import type { Server as HttpServer } from 'http';

export function setupSocketIO(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ---- Match rooms (Phase 2) ----
    socket.on('match:join', (matchId: string) => {
      socket.join(`match:${matchId}`);
      console.log(`🏟️  Socket ${socket.id} joined match ${matchId}`);
    });

    socket.on('match:leave', (matchId: string) => {
      socket.leave(`match:${matchId}`);
    });

    // ---- Auction rooms (Phase 4) ----
    socket.on('auction:join', (auctionId: string) => {
      socket.join(`auction:${auctionId}`);
      console.log(`💰 Socket ${socket.id} joined auction ${auctionId}`);
    });

    socket.on('auction:leave', (auctionId: string) => {
      socket.leave(`auction:${auctionId}`);
    });

    // ---- Disconnect ----
    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  console.log('🔌 Socket.IO initialized');
  return io;
}
