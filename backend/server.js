const http = require('http');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables before importing app/db
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const { initChatSocket } = require('./sockets/chatSocket');
const { setNotificationSocketIO } = require('./services/notificationService');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Bind socket to real-time chat and notification dispatcher
setNotificationSocketIO(io);
initChatSocket(io);

const { runAutoSeedIfEmpty } = require('./services/autoSeedService');

// Connect to Database, auto-seed if needed, and start listening
const startServer = async () => {
  try {
    await connectDB();
    await runAutoSeedIfEmpty();

    server.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 SkillBridge Backend API is live on port ${PORT}`);
      console.log(`📡 WebSocket server running with Socket.IO`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('❌ Server startup failed:', err.message);
    process.exit(1);
  }
};

startServer();
