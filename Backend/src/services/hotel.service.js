const sequelize = require("../configs/database");

const getHotelDetail = async (hotelId) => {
    // 1. Hotel info
    const [hotelRows] = await sequelize.query(
        `
    SELECT 
      MaKS,
      TenKS,
      DiaChi,
      HangSao
    FROM khach_san
    WHERE MaKS = :hotelId
    `,
        { replacements: { hotelId } }
    );

    if (hotelRows.length === 0) {
        throw new Error("Hotel not found");
    }

    const hotel = hotelRows[0];

    // 2. Room types for this hotel
    const [roomRows] = await sequelize.query(
        `
    SELECT 
      lp.MaLoaiPhong,
      lp.TenPhong,
      lp.GiaPhong,
      lp.SoNguoiOToiDa
    FROM loai_phong lp
    WHERE lp.MaKS = :hotelId
    ORDER BY lp.GiaPhong ASC
    `,
        { replacements: { hotelId } }
    );

    // 3. Availability for all room types of this hotel
    const [availabilityRows] = await sequelize.query(
        `
    SELECT 
      tt.MaPhongKhaDung,
      tt.MaLoaiPhong,
      tt.NgayDatPhong,
      tt.SoLuongPhongCoSan,
      tt.TongTien
    FROM tinh_trang_phong_trong tt
    JOIN loai_phong lp ON tt.MaLoaiPhong = lp.MaLoaiPhong
    WHERE lp.MaKS = :hotelId
      AND tt.SoLuongPhongCoSan > 0
    ORDER BY tt.NgayDatPhong
    `,
        { replacements: { hotelId } }
    );

    // 4. Reviews (linked via booking detail for this hotel's rooms)
    const [reviewRows] = await sequelize.query(
        `
    SELECT 
      dg.SoSao,
      dg.NoiDung,
      dg.NgayDanhGia,
      u.Ho,
      u.Ten
    FROM danh_gia dg
    JOIN users u ON dg.UserID = u.UserID
    JOIN chi_tiet_booking ctb ON dg.MaCTBooking = ctb.MaCTBooking
    JOIN ctbooking_hotel cth ON ctb.MaCTBooking = cth.MaCTBooking
    JOIN tinh_trang_phong_trong tt ON cth.MaPhongKhaDung = tt.MaPhongKhaDung
    JOIN loai_phong lp ON tt.MaLoaiPhong = lp.MaLoaiPhong
    WHERE lp.MaKS = :hotelId
    ORDER BY dg.NgayDanhGia DESC
    LIMIT 20
    `,
        { replacements: { hotelId } }
    );

    return {
        hotel: {
            id: hotel.MaKS,
            name: hotel.TenKS,
            address: hotel.DiaChi,
            stars: hotel.HangSao,
        },
        rooms: roomRows.map((r) => ({
            roomTypeId: r.MaLoaiPhong,
            name: r.TenPhong,
            price: r.GiaPhong,
            maxGuests: r.SoNguoiOToiDa,
        })),
        availability: availabilityRows.map((a) => ({
            id: a.MaPhongKhaDung,
            roomTypeId: a.MaLoaiPhong,
            date: a.NgayDatPhong,
            availableRooms: a.SoLuongPhongCoSan,
            totalPrice: a.TongTien,
        })),
        reviews: reviewRows.map((r) => ({
            rating: r.SoSao,
            comment: r.NoiDung,
            date: r.NgayDanhGia,
            userName: `${r.Ho} ${r.Ten}`,
        })),
    };
};

module.exports = { getHotelDetail };
