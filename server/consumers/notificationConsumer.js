const messageBroker = require('../utils/messageBroker');
const logger = require('../utils/logger');
const socketAPI = require('../socket');
const Notification = require('../models/Notification');

const formatError = (err) => {
    if (!err) {
        return 'Unknown error';
    }

    if (err.message) {
        return err.message;
    }

    if (Array.isArray(err.errors) && err.errors.length > 0) {
        return err.errors
            .map((item) => item && item.message)
            .filter(Boolean)
            .join(' | ');
    }

    return String(err);
};

async function startNotificationConsumer() {
    try {
        const ch = await messageBroker.ensureChannel();
        if (!ch) {
            logger.warn('RabbitMQ channel is not ready. Notification consumer is disabled.');
            return;
        }

        const queueName = 'email_notifications';
        await ch.assertQueue(queueName);

        logger.info(`RabbitMQ Consumer started listening on ${queueName}`);

        ch.consume(queueName, async (msg) => {
            if (msg === null) return;
            try {
                const payload = JSON.parse(msg.content.toString());
                logger.debug(`[Consumer] Processing event for user: ${payload.userId || payload.username}`);

                const title = payload.title || 'Sistem Bildirimi';
                const message = payload.message || 'Yeni bir bildiriminiz var.';
                const type = payload.type || 'info';

                const targetKeys = [payload.userId, payload.username]
                    .filter(Boolean)
                    .map((value) => String(value));

                if (targetKeys.length > 0) {
                    // Persist first so the notification survives even if the user is
                    // offline; the socket emit below is best-effort delivery.
                    const recipient = String(payload.username || payload.userId);
                    try {
                        await Notification.create({ recipient, title, message, type });
                    } catch (persistErr) {
                        logger.error(`[Consumer] Failed to persist notification: ${persistErr.message}`);
                    }

                    const io = socketAPI.getIO();
                    const onlineUsers = socketAPI.getOnlineUsers();
                    const socketId = targetKeys
                        .map((key) => onlineUsers.get(key))
                        .find(Boolean);

                    if (socketId) {
                        io.to(socketId).emit('new_notification', { title, message, type, timestamp: new Date() });
                    }
                }

                // Acknowledge the message to drop it from queue safely
                ch.ack(msg);
            } catch (err) {
                logger.error(`[Consumer] Error processing message: ${err.message}`);
                // Drop the poison message (requeue=false) instead of leaving it
                // unacked — an unacked malformed message is redelivered on every
                // reconnect and loops forever.
                try { ch.nack(msg, false, false); } catch { /* channel may be closed */ }
            }
        });
        
    } catch (error) {
        logger.warn(`Notification consumer setup failed. Continuing without consumer. Details: ${formatError(error)}`);
    }
}

module.exports = { startNotificationConsumer };
