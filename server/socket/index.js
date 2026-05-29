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
        const parseCookie = (cookieHeader, name) => {
            if (!cookieHeader) return null;
            const match = cookieHeader.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
            return match ? decodeURIComponent(match[1]) : null;
        };
        io.use((socket, next) => {
            // Accept the httpOnly cookie (sent with withCredentials) as well as the
            // legacy auth.token / Authorization header.
            const token = socket.handshake.auth?.token
                || parseCookie(socket.handshake.headers?.cookie, 'token')
                || socket.handshake.headers?.authorization?.split(' ')[1];
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

            // Identity is taken from the verified JWT (socket.user), NOT from client
            // input, so a socket can only register under its own user keys. Trusting
            // a client-supplied identity allowed registering under another user's key
            // and hijacking notifications/messages directed at that user.
            socket.on("register_user", () => {
                const userId = toKey(socket.user && (socket.user.id || socket.user._id));
                const username = toKey(socket.user && socket.user.username);

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

            // Rooms implementation for generic messaging (like emails).
            // A socket may only join a room scoped to its own verified identity,
            // otherwise any authenticated user could join another user's room and
            // eavesdrop on their messages.
            socket.on("join_room", (room) => {
                const allowed = new Set([
                    toKey(socket.user && socket.user.id),
                    toKey(socket.user && socket.user._id),
                    toKey(socket.user && socket.user.username)
                ].filter(Boolean));

                if (!allowed.has(toKey(room))) {
                    logger.warn(`🚫 Socket ${socket.id} denied join to room: ${room}`);
                    return;
                }
                socket.join(room);
                logger.info(`👥 Socket ${socket.id} joined room: ${room}`);
            });

            socket.on("send_message", (data) => {
                // Only relay to a room this socket has actually joined.
                if (data && data.room && socket.rooms.has(data.room)) {
                    socket.to(data.room).emit("receive_message", data);
                }
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
