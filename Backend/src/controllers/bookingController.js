const db = require("../models");
const bookingQueue = require("../queues/bookingQueue");
const sequelize = require("../configs/database");

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

    // auto cancel
    await bookingQueue.add(
      "autoCancel",
      {
        bookingId: booking.MaBooking,
      },
      {
        delay: 10000,
      }
    );

    return res.json({
      success: true,
      message: "Tạo booking thành công",
      data: booking,
    });
  } catch (err) {
    if (t) await t.rollback();

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