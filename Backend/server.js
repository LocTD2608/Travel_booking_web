require('dotenv').config();
const express = require('express'); // Phải có dòng này mới dùng được express.json()
const app = require('./src/app');
const cors = require('cors');

// 1. Nhập cái "bản đồ" từ file authRoutes vào đây
const authRoutes = require('./src/routes/authRoutes');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 2. Gắn bản đồ vào server: Cứ ai gọi /api/auth thì đưa cho authRoutes xử lý
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});