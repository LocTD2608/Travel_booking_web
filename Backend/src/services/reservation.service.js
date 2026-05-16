const redisConnection = require('../configs/redis');

// Stub functions when Redis is not available
const noOp = async () => null;

const setHold = redisConnection
    ? async (serviceType, serviceId, userId, ttlSeconds = 600) => {
        const key = `booking:hold:${serviceType}:${serviceId}:${userId}`;
        await redisConnection.set(key, 'HOLD', 'EX', ttlSeconds);
        return key;
    }
    : noOp;

const releaseHold = redisConnection
    ? async (serviceType, serviceId, userId) => {
        const key = `booking:hold:${serviceType}:${serviceId}:${userId}`;
        await redisConnection.del(key);
    }
    : noOp;

const checkHold = redisConnection
    ? async (serviceType, serviceId, userId) => {
        const key = `booking:hold:${serviceType}:${serviceId}:${userId}`;
        const exists = await redisConnection.exists(key);
        return exists === 1;
    }
    : async () => false;

const initExpirationListener = redisConnection
    ? () => {
        redisConnection.subscribe('__keyevent@0__:expired', async (message) => {
            if (message.startsWith('booking:hold:')) {
                const parts = message.split(':');
                if (parts.length >= 5) {
                    const serviceType = parts[2];
                    const serviceId = parts[3];
                    const userId = parts[4];
                    console.log(`[Reservation Expired] Releasing ${serviceType} ${serviceId} for user ${userId}`);
                }
            }
        });
    }
    : () => {};

module.exports = {
    setHold,
    releaseHold,
    checkHold,
    initExpirationListener
};
