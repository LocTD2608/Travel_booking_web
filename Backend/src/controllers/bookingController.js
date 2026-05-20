const db = require("../models");
const bookingQueue = require("../queues/bookingQueue");
const sequelize = require("../configs/database");
const { Op } = require("sequelize");

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
            TenDichVu: d.name || "",
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
    const paidStatuses = ["Đã thanh toán", "DA_THANH_TOAN"];

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

    const { ticket_count = 0, total_revenue = 0 } = stats[0] || {};

    return res.json({
      success: true,
      message: "Thống kê booking thành công",
      data: {
        bookings,
        ticket_count: parseInt(ticket_count, 10) || 0,
        total_revenue: parseFloat(total_revenue) || 0,
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

    // hoàn tiền
    if (booking.TrangThaiBooking === "Đã thanh toán") {
      hoanTien = booking.TongTien;
    }

    await booking.update(
      {
        TrangThaiBooking: "Đã hủy",
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
      message: "Đã hủy booking",
      data: {
        MaBooking: booking.MaBooking,
        TrangThaiBooking: "Đã hủy",
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