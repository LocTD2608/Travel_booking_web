const { redisClient, redisSubscriber } = require('../configs/redis');

/**
 * Service to manage temporary holds for resources.
 * The key format is: booking:hold:{serviceType}:{serviceId}:{userId}
 */

const setHold = async (serviceType, serviceId, userId, ttlSeconds = 600) => {
    const key = `booking:hold:${serviceType}:${serviceId}:${userId}`;
    // Set the key with an expiration time
    await redisClient.set(key, 'HOLD', 'EX', ttlSeconds);
    return key;
};

const releaseHold = async (serviceType, serviceId, userId) => {
    const key = `booking:hold:${serviceType}:${serviceId}:${userId}`;
    await redisClient.del(key);
};

const checkHold = async (serviceType, serviceId, userId) => {
    const key = `booking:hold:${serviceType}:${serviceId}:${userId}`;
    const exists = await redisClient.exists(key);
    return exists === 1;
};

// Start listening for key expirations globally
const initExpirationListener = () => {
    // Subscribe to the expired events channel on DB 0
    redisSubscriber.subscribe('__keyevent@0__:expired', async (message) => {
        // message is the key that expired: e.g., booking:hold:flight:123:456
        if (message.startsWith('booking:hold:')) {
            const parts = message.split(':');
            if (parts.length >= 5) {
                const serviceType = parts[2];
                const serviceId = parts[3];
                const userId = parts[4];

                console.log(`[Reservation Expired] Releasing ${serviceType} ${serviceId} for user ${userId}`);

                // Handle logic to release DB seat based on serviceType
                switch (serviceType) {
                    case 'flight':
                        // Logic to update DB releasing flight seat
                        // Example: await FlightService.releaseSeat(serviceId, userId);
                        break;
                    case 'hotel':
                        // Logic to update DB releasing hotel room
                        break;
                    case 'train':
                        // Logic to update DB releasing train seat
                        break;
                    default:
                        console.log(`Unknown serviceType: ${serviceType}`);
                }
            }
        }
    });
};

module.exports = {
    setHold,
    releaseHold,
    checkHold,
    initExpirationListener
};
