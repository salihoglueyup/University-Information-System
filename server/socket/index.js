let io;
const onlineUsers = new Map(); // Store online users: { userKey: socketId }
const socketUserKeys = new Map(); // Store reverse mapping: { socketId: Set<userKey> }

const toKey = (value) => (value === undefined || value === null ? '' : String(value).trim());
const logger = require('../utils/logger');

module.exports = {
    init: (httpServer) => {
        const { Server } = require('socket.io');
        
        // In development, allow origins from host machine (localhost), Docker network, and any origin
        // In production, this should be restricted to your domain
        const isDev = process.env.NODE_ENV === 'development';
        const corsConfig = isDev 
            ? {
                origin: true, // Allow all origins in development
                methods: ["GET", "POST"],
                credentials: true
            }
            : {
                origin: process.env.CLIENT_URL || 'http://localhost:5173',
                methods: ["GET", "POST"],
                credentials: true
            };

        io = new Server(httpServer, {
            cors: corsConfig,
            pingTimeout: 60000,
            pingInterval: 25000
        });

        // Socket.io authentication middleware
        io.use((socket, next) => {
            const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
            if (!token) {
                return next(new Error('Authentication required'));
            }
            try {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SEC);
                socket.user = decoded;
                next();
            } catch {
                next(new Error('Invalid token'));
            }
        });

        io.on("connection", (socket) => {
            logger.info(`📡 New Socket Connection: ${socket.id}`);

            // Client can register with either a username string (legacy) or identity object.
            socket.on("register_user", (identity) => {
                const userId = toKey(identity && typeof identity === 'object' ? (identity.userId || identity.id || identity._id) : '');
                const username = toKey(identity && typeof identity === 'object' ? identity.username : identity);

                const keys = new Set([userId, username].filter(Boolean));

                if (keys.size === 0) {
                    return;
                }

                socketUserKeys.set(socket.id, keys);
                for (const key of keys) {
                    onlineUsers.set(key, socket.id);
                }

                logger.info(`👤 User registered to Socket: ${Array.from(keys).join(', ')} -> ${socket.id}`);

                // Broadcast unique online user count (deduplicate by socket count)
                io.emit("online_users_count", socketUserKeys.size);
            });

            // Rooms implementation for generic messaging (like emails)
            socket.on("join_room", (room) => {
                socket.join(room);
                logger.info(`👥 Socket ${socket.id} joined room: ${room}`);
            });

            socket.on("send_message", (data) => {
                socket.to(data.room).emit("receive_message", data);
            });

            socket.on("disconnect", () => {
                logger.info(`🔌 Socket Disconnected: ${socket.id}`);

                // Remove from online map
                const registeredKeys = socketUserKeys.get(socket.id) || new Set();
                for (const key of registeredKeys) {
                    const sid = onlineUsers.get(key);
                    if (sid === socket.id) {
                        onlineUsers.delete(key);
                        logger.info(`👤 User unregistered: ${key}`);
                    }
                }
                socketUserKeys.delete(socket.id);
                io.emit("online_users_count", socketUserKeys.size);
            });
        });

        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io is not initialized!");
        }
        return io;
    },
    getOnlineUsers: () => {
        return onlineUsers;
    }
};
