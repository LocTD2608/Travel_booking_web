const mysql = require('mysql2/promise');

// Cấu hình kết nối đến XAMPP MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',       // User mặc định của XAMPP
    password: '',       // Pass mặc định của XAMPP là để trống
    database: 'travel_booking', // Tên database bạn đã tạo trong phpMyAdmin
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(() => console.log('✅ Database connected successfully!'))
    .catch((err) => console.error('❌ Database connection failed:', err.message));

module.exports = pool;