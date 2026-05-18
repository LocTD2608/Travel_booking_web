const sequelize = require("../configs/database");
const { QueryTypes } = require("sequelize");

exports.getDashboardStats = async (req, res) => {
  try {

    // Tổng người dùng
    const totalUsers = await sequelize.query(
      `
      SELECT COUNT(*) AS tongNguoiDung
      FROM users
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    // Tổng booking
    const totalBookings = await sequelize.query(
      `
      SELECT COUNT(*) AS tongBooking
      FROM booking
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    // Tổng doanh thu
    const totalRevenue = await sequelize.query(
      `
      SELECT SUM(TongTien) AS tongDoanhThu
      FROM booking
      WHERE TrangThaiBooking = 'Đã thanh toán'
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    // Booking hôm nay
    const todayBookings = await sequelize.query(
      `
      SELECT COUNT(*) AS bookingHomNay
      FROM booking
      WHERE DATE(ThoiDiemDat) = CURDATE()
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    // Thống kê trạng thái booking
    const bookingStatus = await sequelize.query(
      `
      SELECT 
        TrangThaiBooking,
        COUNT(*) AS tongSoLuong
      FROM booking
      GROUP BY TrangThaiBooking
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    // Thống kê booking theo tháng
    const bookingsByMonth = await sequelize.query(
      `
      SELECT 
        MONTH(ThoiDiemDat) AS thang,

        COUNT(*) AS tongBooking,

        SUM(
          CASE 
            WHEN TrangThaiBooking = 'Đã thanh toán'
            THEN TongTien
            ELSE 0
          END
        ) AS doanhThu

      FROM booking

      WHERE YEAR(ThoiDiemDat) = YEAR(CURDATE())

      GROUP BY MONTH(ThoiDiemDat)

      ORDER BY thang
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    // Booking gần đây
    const recentBookings = await sequelize.query(
      `
      SELECT MaBooking, UserID, TongTien, TrangThaiBooking, ThoiDiemThanhToan, ThoiDiemDat
      FROM booking
      ORDER BY ThoiDiemDat DESC
      LIMIT 5
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        tongNguoiDung: totalUsers[0].tongNguoiDung || 0,

        tongBooking: totalBookings[0].tongBooking || 0,

        tongDoanhThu: totalRevenue[0].tongDoanhThu || 0,

        bookingHomNay: todayBookings[0].bookingHomNay || 0,

        thongKeTrangThaiBooking: bookingStatus,

        thongKeBookingTheoThang: bookingsByMonth,

        recentBookings: recentBookings,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};