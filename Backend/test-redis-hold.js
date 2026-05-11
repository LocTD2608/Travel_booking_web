require('dotenv').config();
const { connectRedis } = require('./src/configs/redis');
const { setHold, initExpirationListener } = require('./src/services/reservation.service');

const runTest = async () => {
    console.log("=== Bắt đầu Test Module Giữ Chỗ ===");
    await connectRedis();
    initExpirationListener();

    console.log("=> Đang tạo booking hold ảo 5 giây...");
    const holdKey = await setHold("flight", "123", "user_456", 5);
    console.log(`=> Đã tạo key thành công: ${holdKey}`);

    console.log("=> Chờ 5 giây để Redis tự động expire...");
    // Process should terminate after or stay alive if there are open handles
    setTimeout(() => {
        console.log("=> Kết thúc thời gian chờ script.");
        process.exit(0);
    }, 7000);
};

runTest();
