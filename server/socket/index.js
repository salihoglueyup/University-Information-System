let io;
const onlineUsers = new Map(); // Store online users: { userKey: socketId }
const socketUserKeys = new Map(); // Store reverse mapping: { socketId: Set<userKey> }

const toKey = (value) => (value === undefined || value === null ? '' : String(value).trim());

module.exports = {
    init: (httpServer) => {
        const { Server } = require('socket.io');
        const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

        io = new Server(httpServer, {
            cors: {
                origin: CLIENT_URL,
                methods: ["GET", "POST"]
            } // We can add Redis Adapter here in the future
        });

        io.on("connection", (socket) => {
            console.log(`📡 New Socket Connection: ${socket.id}`);

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

                console.log(`👤 User registered to Socket: ${Array.from(keys).join(', ')} -> ${socket.id}`);

                // Broadcast online user count
                io.emit("online_users_count", onlineUsers.size);
            });

            // Rooms implementation for generic messaging (like emails)
            socket.on("join_room", (room) => {
                socket.join(room);
                console.log(`👥 Socket ${socket.id} joined room: ${room}`);
            });

            socket.on("send_message", (data) => {
                socket.to(data.room).emit("receive_message", data);
            });

            socket.on("disconnect", () => {
                console.log(`🔌 Socket Disconnected: ${socket.id}`);

                // Remove from online map
                const registeredKeys = socketUserKeys.get(socket.id) || new Set();
                for (const key of registeredKeys) {
                    const sid = onlineUsers.get(key);
                    if (sid === socket.id) {
                        onlineUsers.delete(key);
                        console.log(`👤 User unregistered: ${key}`);
                    }
                }
                socketUserKeys.delete(socket.id);
                io.emit("online_users_count", onlineUsers.size);
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
