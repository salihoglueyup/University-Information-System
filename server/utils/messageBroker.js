const amqplib = require('amqplib');
const logger = require('./logger');

let channel, connection;
let connectPromise;
let brokerDisabled = false;
let brokerWarningLogged = false;
let lastRabbitErrorMessage = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

const formatRabbitError = (err) => {
    if (!err) {
        return 'Unknown RabbitMQ error';
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

async function connectQueue() {
    if (brokerDisabled) {
        return { connection: null, channel: null };
    }

    if (channel && connection) {
        return { connection, channel };
    }

    if (connectPromise) {
        return connectPromise;
    }

    connectPromise = (async () => {
    try {
        connection = await amqplib.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        // Ensure important queues exist
        await channel.assertQueue('email_notifications');
        await channel.assertQueue('analytics_events');

        logger.info('RabbitMQ message broker connected.');
        lastRabbitErrorMessage = null;
        brokerWarningLogged = false;
        return { connection, channel };
    } catch (error) {
        const formattedError = formatRabbitError(error);

        if (formattedError !== lastRabbitErrorMessage) {
            logger.warn(`RabbitMQ is unavailable. Continuing without broker. Details: ${formattedError}`);
            lastRabbitErrorMessage = formattedError;
        }

        brokerDisabled = true;
        if (!brokerWarningLogged) {
            brokerWarningLogged = true;
            logger.warn('RabbitMQ-backed async notifications/events are disabled for this process.');
        }

        return { connection: null, channel: null };
    } finally {
        connectPromise = null;
    }
    })();

    return connectPromise;
}

function getChannel() {
    return channel;
}

function getConnection() {
    return connection;
}

async function ensureChannel() {
    if (channel) return channel;

    await connectQueue();
    return channel;
}

// Function to publish events safely
async function publishEvent(queueName, data) {
    try {
        const ch = await ensureChannel();
        if (!ch) {
            logger.warn(`RabbitMQ channel is not ready. Dropping event for queue: ${queueName}`);
            return;
        }

        await ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
        logger.debug(`Published event to ${queueName}`);
    } catch (err) {
        logger.warn(`Failed to publish event to ${queueName}: ${formatRabbitError(err)}`);
    }
}

module.exports = {
    connectQueue,
    getConnection,
    getChannel,
    publishEvent,
    ensureChannel
};
