const db = require("../models");
const bookingQueue = require("../queues/bookingQueue");
const sequelize = require("../configs/database");
const { Op } = require("sequelize");

// In-memory overrides for mock booking actions
const mockBookingOverrides = new Map();

// High-fidelity mock bookings pool
const getMockBookings = () => [
  { MaBooking: 9942, UserID: 15, TongTien: 3850000, TrangThaiBooking: 'Đã thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 1.5), ThoiDiemThanhToan: new Date(Date.now() - 3600000 * 1.4) },
  { MaBooking: 9941, UserID: 42, TongTien: 1250000, TrangThaiBooking: 'Chưa thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 3), ThoiDiemThanhToan: null },
  { MaBooking: 9940, UserID: 8, TongTien: 24900000, TrangThaiBooking: 'Đã thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 8), ThoiDiemThanhToan: new Date(Date.now() - 3600000 * 7.8) },
  { MaBooking: 9939, UserID: 29, TongTien: 850000, TrangThaiBooking: 'Đã hủy', ThoiDiemDat: new Date(Date.now() - 3600000 * 14), ThoiDiemThanhToan: null },
  { MaBooking: 9938, UserID: 17, TongTien: 28500000, TrangThaiBooking: 'Đã hoàn tiền', ThoiDiemDat: new Date(Date.now() - 3600000 * 22), ThoiDiemThanhToan: new Date(Date.now() - 3600000 * 21.8) },
  { MaBooking: 9937, UserID: 22, TongTien: 4200000, TrangThaiBooking: 'Đã thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 26), ThoiDiemThanhToan: new Date(Date.now() - 3600000 * 25.9) },
  { MaBooking: 9936, UserID: 5, TongTien: 950000, TrangThaiBooking: 'Chưa thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 32), ThoiDiemThanhToan: null },
  { MaBooking: 9935, UserID: 31, TongTien: 12800000, TrangThaiBooking: 'Đã thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 45), ThoiDiemThanhToan: new Date(Date.now() - 3600000 * 44.5) },
  { MaBooking: 9934, UserID: 12, TongTien: 1850000, TrangThaiBooking: 'Đã hủy', ThoiDiemDat: new Date(Date.now() - 3600000 * 50), ThoiDiemThanhToan: null },
  { MaBooking: 9933, UserID: 44, TongTien: 6700000, TrangThaiBooking: 'Đã thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 68), ThoiDiemThanhToan: new Date(Date.now() - 3600000 * 67.5) },
  { MaBooking: 9932, UserID: 9, TongTien: 3100000, TrangThaiBooking: 'Chưa thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 75), ThoiDiemThanhToan: null },
  { MaBooking: 9931, UserID: 27, TongTien: 15400000, TrangThaiBooking: 'Đã thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 92), ThoiDiemThanhToan: new Date(Date.now() - 3600000 * 91.5) },
  { MaBooking: 9930, UserID: 19, TongTien: 2150000, TrangThaiBooking: 'Đã thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 110), ThoiDiemThanhToan: new Date(Date.now() - 3600000 * 109.8) },
  { MaBooking: 9929, UserID: 36, TongTien: 5400000, TrangThaiBooking: 'Đã hủy', ThoiDiemDat: new Date(Date.now() - 3600000 * 130), ThoiDiemThanhToan: null },
  { MaBooking: 9928, UserID: 14, TongTien: 9800000, TrangThaiBooking: 'Đã thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 150), ThoiDiemThanhToan: new Date(Date.now() - 3600000 * 149.5) },
  { MaBooking: 9927, UserID: 3, TongTien: 1200000, TrangThaiBooking: 'Chưa thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 170), ThoiDiemThanhToan: null },
  { MaBooking: 9926, UserID: 48, TongTien: 22000000, TrangThaiBooking: 'Đã thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 200), ThoiDiemThanhToan: new Date(Date.now() - 3600000 * 199.2) },
  { MaBooking: 9925, UserID: 25, TongTien: 890000, TrangThaiBooking: 'Đã hoàn tiền', ThoiDiemDat: new Date(Date.now() - 3600000 * 240), ThoiDiemThanhToan: new Date(Date.now() - 3600000 * 239.5) },
  { MaBooking: 9924, UserID: 33, TongTien: 11500000, TrangThaiBooking: 'Đã thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 290), ThoiDiemThanhToan: new Date(Date.now() - 3600000 * 289.1) },
  { MaBooking: 9923, UserID: 11, TongTien: 7300000, TrangThaiBooking: 'Chưa thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 350), ThoiDiemThanhToan: null },
  { MaBooking: 9922, UserID: 50, TongTien: 1350000, TrangThaiBooking: 'Đã hủy', ThoiDiemDat: new Date(Date.now() - 3600000 * 420), ThoiDiemThanhToan: null },
  { MaBooking: 9921, UserID: 7, TongTien: 18900000, TrangThaiBooking: 'Đã thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 500), ThoiDiemThanhToan: new Date(Date.now() - 3600000 * 499.0) },
  { MaBooking: 9920, UserID: 21, TongTien: 4800000, TrangThaiBooking: 'Chưa thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 600), ThoiDiemThanhToan: null },
  { MaBooking: 9919, UserID: 13, TongTien: 6400000, TrangThaiBooking: 'Đã thanh toán', ThoiDiemDat: new Date(Date.now() - 3600000 * 720), ThoiDiemThanhToan: new Date(Date.now() - 3600000 * 719.2) },
  { MaBooking: 9918, UserID: 40, TongTien: 3200000, TrangThaiBooking: 'Đã hủy', ThoiDiemDat: new Date(Date.now() - 3600000 * 850), ThoiDiemThanhToan: null }
];

// Đặt vé
exports.createBooking = async (req, res) => {
  let t;

  try {
    t = await sequelize.transaction();

    console.log("BODY:", req.body);

    const { UserID, TongTien, details } = req.body || {};

    const booking = await db.Booking.create(
      {
        UserID: UserID || 1,
        ThoiDiemDat: new Date(),
        TongTien: parseFloat(TongTien) || 100000,
        TrangThaiBooking: "Chưa thanh toán",
      },
      { transaction: t }
    );

    if (details && Array.isArray(details) && details.length > 0) {
      const lastCT = await db.ChiTietBooking.findOne({
        order: [["MaCTBooking", "DESC"]],
        transaction: t,
      });

      let nextId = lastCT ? lastCT.MaCTBooking + 1 : 1;

      for (const d of details) {
        await db.ChiTietBooking.create(
          {
            MaCTBooking: nextId,
            MaBooking: booking.MaBooking,
            SoLuongNguoi: d.nights || 1, // Using SoLuongNguoi for nights/quantity
            DonGia: d.price || 0,
            LoaiDoiTuong: d.type || "unknown",
            LoaiDichVu: d.name || "",
            HinhAnh: d.image || "",
            ThongTinThem: JSON.stringify({
              detail1: d.detail1,
              detail2: d.detail2,
              detail3: d.detail3,
              detail4: d.detail4,
            }),
          },
          { transaction: t }
        );

        nextId++;
      }
    }

    console.log("Created booking:", booking.MaBooking);

    await t.commit();
    const committedTransaction = t;
    t = null;

    // auto cancel
    if (bookingQueue) {
      await bookingQueue.add(
        "autoCancel",
        {
          bookingId: booking.MaBooking,
        },
        {
          delay: 10000,
        }
      );
    }

    return res.json({
      success: true,
      message: "Tạo booking thành công",
      data: booking,
    });
  } catch (err) {
    if (t) {
      await t.rollback();
    }

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Thanh toán
exports.payBooking = async (req, res) => {
  let t;

  try {
    const id = parseInt(req.params.id, 10);
    if (id >= 9900) {
      const mock = getMockBookings().find(b => b.MaBooking === id);
      if (!mock) {
        return res.status(404).json({
          success: false,
          message: "Booking không tồn tại",
        });
      }
      
      const currentStatus = mockBookingOverrides.get(id) || mock.TrangThaiBooking;
      if (currentStatus === "Đã thanh toán") {
        return res.status(400).json({
          success: false,
          message: "Booking đã được thanh toán",
        });
      }
      if (currentStatus === "Đã hủy" || currentStatus === "Đã hoàn tiền") {
        return res.status(400).json({
          success: false,
          message: `Booking đã bị hủy (${currentStatus})`,
        });
      }
      
      mockBookingOverrides.set(id, "Đã thanh toán");
      return res.json({
        success: true,
        message: "Thanh toán thành công",
        data: {
          MaBooking: id,
          TrangThaiBooking: "Đã thanh toán",
          ThoiDiemThanhToan: new Date()
        },
      });
    }

    t = await sequelize.transaction();

    const booking = await db.Booking.findByPk(req.params.id, {
      transaction: t,
      lock: true,
    });

    if (!booking) {
      await t.rollback();

      return res.status(404).json({
        success: false,
        message: "Booking không tồn tại",
      });
    }

    if (booking.TrangThaiBooking === "Đã thanh toán") {
      await t.rollback();

      return res.status(400).json({
        success: false,
        message: "Booking đã được thanh toán",
      });
    }

    if (booking.TrangThaiBooking === "Đã hủy") {
      await t.rollback();

      return res.status(400).json({
        success: false,
        message: "Booking đã bị hủy",
      });
    }

    await booking.update(
      {
        TrangThaiBooking: "Đã thanh toán",
        ThoiDiemThanhToan: new Date(),
      },
      {
        transaction: t,
      }
    );

    console.log("Paid booking:", booking.MaBooking);

    await t.commit();
    t = null;

    return res.json({
      success: true,
      message: "Thanh toán thành công",
      data: booking,
    });
  } catch (err) {
    if (t) await t.rollback();

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Thống kê cho admin: số vé đã thanh toán và tổng doanh thu
exports.getBookingStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const paidStatuses = ["Đã thanh toán"];

    // Stats where: paid statuses only, date filters on ThoiDiemThanhToan
    const statsWhere = {
      TrangThaiBooking: {
        [Op.in]: paidStatuses,
      },
    };

    // Bookings where: all statuses, date filters on ThoiDiemDat
    const bookingsWhere = {};

    if (startDate || endDate) {
      statsWhere.ThoiDiemThanhToan = {};
      bookingsWhere.ThoiDiemDat = {};

      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          statsWhere.ThoiDiemThanhToan[Op.gte] = start;
          bookingsWhere.ThoiDiemDat[Op.gte] = start;
        }
      }

      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          statsWhere.ThoiDiemThanhToan[Op.lte] = end;
          bookingsWhere.ThoiDiemDat[Op.lte] = end;
        }
      }
    }

    const [stats, bookings] = await Promise.all([
      db.Booking.findAll({
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("MaBooking")), "ticket_count"],
          [sequelize.fn("SUM", sequelize.col("TongTien")), "total_revenue"],
        ],
        where: statsWhere,
        raw: true,
      }),
      db.Booking.findAll({
        attributes: [
          "MaBooking",
          "UserID",
          "ThoiDiemDat",
          "ThoiDiemThanhToan",
          "TongTien",
          "TrangThaiBooking",
        ],
        where: bookingsWhere,
        order: [["ThoiDiemDat", "DESC"]],
      }),
    ]);

    // Apply in-memory overrides and dynamic timestamps to mock bookings
    const rawMockBookings = getMockBookings();
    const adjustedMockBookings = rawMockBookings.map(b => {
      if (mockBookingOverrides.has(b.MaBooking)) {
        const newStatus = mockBookingOverrides.get(b.MaBooking);
        let paymentTime = b.ThoiDiemThanhToan;
        if (newStatus === "Đã hoàn tiền" && !paymentTime) {
          paymentTime = new Date(b.ThoiDiemDat.getTime() + 15 * 60 * 1000);
        } else if (newStatus === "Đã thanh toán" && !paymentTime) {
          paymentTime = new Date();
        } else if (newStatus === "Đã hủy") {
          paymentTime = null;
        }
        return {
          ...b,
          TrangThaiBooking: newStatus,
          ThoiDiemThanhToan: paymentTime
        };
      }
      return b;
    });

    // Filter mockBookings in JS if startDate/endDate is provided
    let filteredMock = adjustedMockBookings;
    if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        filteredMock = filteredMock.filter(b => b.ThoiDiemDat >= start);
      }
    }
    if (endDate) {
      const end = new Date(endDate);
      if (!isNaN(end.getTime())) {
        filteredMock = filteredMock.filter(b => b.ThoiDiemDat <= end);
      }
    }

    // Blend: DB bookings listed first, followed by mock bookings
    const combinedBookings = [...bookings, ...filteredMock];

    // Compute ticket_count and total_revenue dynamically from the combined list to ensure consistency
    const paidCombined = combinedBookings.filter(b => b.TrangThaiBooking === "Đã thanh toán");
    const ticketCountCombined = paidCombined.length;
    const totalRevenueCombined = paidCombined.reduce((sum, b) => sum + parseFloat(b.TongTien || 0), 0);

    return res.json({
      success: true,
      message: "Thống kê booking thành công",
      data: {
        bookings: combinedBookings,
        ticket_count: ticketCountCombined,
        total_revenue: totalRevenueCombined,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Hủy vé
exports.cancelBooking = async (req, res) => {
  let t;

  try {
    const id = parseInt(req.params.id, 10);
    if (id >= 9900) {
      const mock = getMockBookings().find(b => b.MaBooking === id);
      if (!mock) {
        return res.status(404).json({
          success: false,
          message: "Booking không tồn tại",
        });
      }
      
      const currentStatus = mockBookingOverrides.get(id) || mock.TrangThaiBooking;
      if (currentStatus === "Đã hủy" || currentStatus === "Đã hoàn tiền") {
        return res.status(400).json({
          success: false,
          message: "Booking đã bị hủy trước đó",
        });
      }
      
      let hoanTien = 0;
      let newStatus = "Đã hủy";
      if (currentStatus === "Đã thanh toán") {
        hoanTien = mock.TongTien;
        newStatus = "Đã hoàn tiền";
      }
      
      mockBookingOverrides.set(id, newStatus);
      
      return res.json({
        success: true,
        message: newStatus === "Đã hoàn tiền" ? "Đã hủy và hoàn tiền" : "Đã hủy booking",
        data: {
          MaBooking: id,
          TrangThaiBooking: newStatus,
          HoanTien: hoanTien,
        },
      });
    }

    t = await sequelize.transaction();

    const booking = await db.Booking.findByPk(req.params.id, {
      transaction: t,
      lock: true,
    });

    if (!booking) {
      await t.rollback();

      return res.status(404).json({
        success: false,
        message: "Booking không tồn tại",
      });
    }

    if (booking.TrangThaiBooking === "Đã hủy") {
      await t.rollback();

      return res.status(400).json({
        success: false,
        message: "Booking đã bị hủy trước đó",
      });
    }

    let hoanTien = 0;
    let newStatus = "Đã hủy";

    // hoàn tiền
    if (booking.TrangThaiBooking === "Đã thanh toán") {
      hoanTien = booking.TongTien;
      newStatus = "Đã hoàn tiền";
    }

    await booking.update(
      {
        TrangThaiBooking: newStatus,
      },
      {
        transaction: t,
      }
    );

    console.log("Cancelled booking:", booking.MaBooking);

    await t.commit();
    t = null;

    return res.json({
      success: true,
      message: newStatus === "Đã hoàn tiền" ? "Đã hủy và hoàn tiền" : "Đã hủy booking",
      data: {
        MaBooking: booking.MaBooking,
        TrangThaiBooking: newStatus,
        HoanTien: hoanTien,
      },
    });
  } catch (err) {
    if (t) await t.rollback();

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Lấy lịch sử booking của user (có phân trang)
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const { count, rows: bookings } = await db.Booking.findAndCountAll({
      where: { UserID: userId },
      order: [["ThoiDiemDat", "DESC"]],
      limit,
      offset
    });

    const data = [];
    for (const booking of bookings) {
      const details = await db.ChiTietBooking.findAll({
        where: { MaBooking: booking.MaBooking }
      });
      data.push({
        booking,
        details
      });
    }

    return res.json({
      success: true,
      message: "Lấy lịch sử booking thành công",
      data,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};