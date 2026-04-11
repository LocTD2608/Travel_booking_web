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

const updateRoomAvailability = async (roomId, bookingDate, quantityToSubtract) => {
    // 1. Tạo một transaction để đảm bảo tính nguyên tử và cho phép locking
    return await sequelize.transaction(async (t) => {
        
        // 2. Thực hiện SELECT ... FOR UPDATE để khóa dòng dữ liệu
        const rows = await sequelize.query(
            `SELECT SoLuongPhongCoSan 
             FROM tinh_trang_phong_trong 
             WHERE MaLoaiPhong = :roomId AND NgayDatPhong = :bookingDate 
             FOR UPDATE`, 
            {
                replacements: { roomId, bookingDate },
                transaction: t, // Gắn transaction vào query
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (rows.length === 0) {
            throw new Error('Không tìm thấy thông tin phòng cho ngày này.');
        }

        const currentQuantity = rows[0].SoLuongPhongCoSan;

        // 3. Kiểm tra số lượng phòng có đủ không
        if (currentQuantity < quantityToSubtract) {
            throw new Error('Số lượng phòng trống không đủ.');
        }

        // 4. Thực hiện trừ số lượng
        const newQuantity = currentQuantity - quantityToSubtract;
        
        await sequelize.query(
            `UPDATE tinh_trang_phong_trong 
             SET SoLuongPhongCoSan = :newQuantity 
             WHERE MaLoaiPhong = :roomId AND NgayDatPhong = :bookingDate`,
            {
                replacements: { newQuantity, roomId, bookingDate },
                transaction: t // Quan trọng: Phải cùng transaction để commit cùng lúc
            }
        );

        return { success: true, remaining: newQuantity };
    });
};

module.exports = {
  getRoomDetail,
  updateRoomAvailability
};