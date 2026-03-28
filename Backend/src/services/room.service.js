const sequelize = require("../configs/database");

const getRoomDetail = async (roomId) => {
  // 1. Room + Hotel
  const [roomRows] = await sequelize.query(
    `
    SELECT 
      lp.MaLoaiPhong,
      lp.TenPhong,
      lp.GiaPhong,
      lp.SoNguoiOToiDa,
      ks.MaKS,
      ks.TenKS,
      ks.DiaChi
    FROM loai_phong lp
    JOIN khach_san ks ON lp.MaKS = ks.MaKS
    WHERE lp.MaLoaiPhong = :roomId
    `,
    {
      replacements: { roomId },
    }
  );

  if (roomRows.length === 0) {
    throw new Error("Room not found");
  }

  const room = roomRows[0];

  // 2. Availability
  const [availabilityRows] = await sequelize.query(
    `
    SELECT 
      NgayDatPhong,
      SoLuongPhongCoSan,
      TongTien
    FROM tinh_trang_phong_trong
    WHERE MaLoaiPhong = :roomId
    ORDER BY NgayDatPhong
    `,
    {
      replacements: { roomId },
    }
  );

  // 3. Reviews
  const [reviewRows] = await sequelize.query(
    `
    SELECT 
      SoSao,
      NoiDung
    FROM danh_gia
    `
  );

  return {
    roomId: room.MaLoaiPhong,
    roomName: room.TenPhong,
    price: room.GiaPhong,
    maxGuests: room.SoNguoiOToiDa,

    hotel: {
      hotelId: room.MaKS,
      hotelName: room.TenKS,
      address: room.DiaChi,
    },

    availability: availabilityRows.map((item) => ({
      date: item.NgayDatPhong,
      availableRooms: item.SoLuongPhongCoSan,
      totalPrice: item.TongTien,
    })),

    reviews: reviewRows.map((r) => ({
      rating: r.SoSao,
      comment: r.NoiDung,
    })),

    amenities: ["Wifi", "Điều hòa"], // mock
    policies: ["Không hút thuốc"], // mock
  };
};

module.exports = {
  getRoomDetail,
};