const { Sequelize } = require("sequelize");
const db = require("../configs/database");

// ─── FLIGHTS ─────────────────────────────────────────────────────────────────
const searchFlights = async ({ from, to, date, passengers, airline, seatClass, minPrice, maxPrice, sortBy }) => {
  let query = `
    SELECT
      cb.MaChuyenBay,
      sb1.Code       AS from_code,
      sb1.Ten        AS from_name,
      sb2.Code       AS to_code,
      sb2.Ten        AS to_name,
      cb.HangBay,
      cb.HangGhe,
      cb.GiaCoBan    AS price,
      cb.GioKhoiHanh AS departure_time,
      cb.GioHaCanh   AS arrival_time
    FROM CHUYEN_BAY cb
    JOIN TUYEN_DUONG td ON cb.MaTuyenDuong = td.MaTuyenDuong
    JOIN SAN_BAY sb1    ON td.MaSanBayXuatPhat = sb1.MaSanBay
    JOIN SAN_BAY sb2    ON td.MaSanBayDich     = sb2.MaSanBay
    WHERE 1=1
  `;
  const replacements = {};

  if (from) { query += ` AND sb1.Code = :from`; replacements.from = from; }
  if (to) { query += ` AND sb2.Code = :to`; replacements.to = to; }
  if (date) { query += ` AND DATE(cb.GioKhoiHanh) = :date`; replacements.date = date; }
  if (airline) { query += ` AND cb.HangBay = :airline`; replacements.airline = airline; }
  if (seatClass) { query += ` AND cb.HangGhe = :seatClass`; replacements.seatClass = seatClass; }
  if (minPrice) { query += ` AND cb.GiaCoBan >= :minPrice`; replacements.minPrice = minPrice; }
  if (maxPrice) { query += ` AND cb.GiaCoBan <= :maxPrice`; replacements.maxPrice = maxPrice; }

  const orderMap = { price: 'cb.GiaCoBan', duration: 'cb.GioHaCanh', departure: 'cb.GioKhoiHanh' };

  if (sortBy === 'asc' || sortBy === 'desc') {
    query += ` ORDER BY cb.GiaCoBan ${sortBy.toUpperCase()}`;
  } else {
    query += ` ORDER BY ${orderMap[sortBy] || 'cb.GiaCoBan'} ASC`;
  }

  const [rows] = await db.query(query, { replacements });
  return rows;
};

// ─── HOTELS ──────────────────────────────────────────────────────────────────
const searchHotels = async ({ city, checkIn, checkOut, rating, minPrice, maxPrice, sortBy }) => {
  let query = `
    SELECT
      ks.MaKS,
      ks.TenKS   AS name,
      ks.DiaChi  AS address,
      ks.HangSao AS stars,
      MIN(lp.GiaPhong) AS min_price
    FROM KHACH_SAN ks
    LEFT JOIN LOAI_PHONG lp ON ks.MaKS = lp.MaKS
    WHERE 1=1
  `;
  const replacements = {};

  if (city) { query += ` AND ks.DiaChi LIKE :city`; replacements.city = `%${city}%`; }
  if (rating) { query += ` AND ks.HangSao >= :rating`; replacements.rating = rating; }
  if (minPrice) { query += ` AND lp.GiaPhong >= :minPrice`; replacements.minPrice = minPrice; }
  if (maxPrice) { query += ` AND lp.GiaPhong <= :maxPrice`; replacements.maxPrice = maxPrice; }

  query += ` GROUP BY ks.MaKS, ks.TenKS, ks.DiaChi, ks.HangSao`;

  const orderMap = { price: 'min_price', rating: 'ks.HangSao DESC, min_price' };

  if (sortBy === 'asc' || sortBy === 'desc') {
    query += ` ORDER BY min_price ${sortBy.toUpperCase()}`;
  } else {
    query += ` ORDER BY ${orderMap[sortBy] || 'min_price'} ASC`;
  }

  const [rows] = await db.query(query, { replacements });
  return rows;
};

// ─── TRAINS (dùng bảng DICH_VU + DV_TRUNG_CHUYEN) ───────────────────────────
const searchTrains = async ({ from, to, date, priceMax, sortBy }) => {
  let query = `
    SELECT
      dv.MaDV,
      dv.MoTa        AS description,
      dv.Gia         AS price,
      dv.DonViTinh   AS unit,
      tc.DiemDi      AS \`from\`,
      tc.DiemDen     AS \`to\`,
      tc.LoaiVe      AS seat_type
    FROM DICH_VU dv
    JOIN DV_TRUNG_CHUYEN tc ON dv.MaDV = tc.MaDV_TC
    WHERE 1=1
  `;
  const replacements = {};

  if (from) { query += ` AND tc.DiemDi LIKE :from`; replacements.from = `%${from}%`; }
  if (to) { query += ` AND tc.DiemDen LIKE :to`; replacements.to = `%${to}%`; }
  if (priceMax) { query += ` AND dv.Gia <= :priceMax`; replacements.priceMax = priceMax; }

  query += ` ORDER BY dv.Gia ASC`;

  const [rows] = await db.query(query, { replacements });
  return rows;
};

// ─── EXPERIENCES (dùng bảng DICH_VU + DV_DU_LICH) ───────────────────────────
const searchExperiences = async ({ destination, priceMax, sortBy }) => {
  let query = `
    SELECT
      dv.MaDV,
      dv.MoTa      AS description,
      dv.Gia        AS price,
      dv.DonViTinh  AS unit,
      dl.DiemDon             AS pickup,
      dl.DiaDiemThamQuan     AS attraction
    FROM DICH_VU dv
    JOIN DV_DU_LICH dl ON dv.MaDV = dl.MaDV_DL
    WHERE 1=1
  `;
  const replacements = {};

  if (destination) {
    query += ` AND (dl.DiaDiemThamQuan LIKE :dest OR dl.DiemDon LIKE :dest)`;
    replacements.dest = `%${destination}%`;
  }
  if (priceMax) { query += ` AND dv.Gia <= :priceMax`; replacements.priceMax = priceMax; }

  query += ` ORDER BY dv.Gia ASC`;

  const [rows] = await db.query(query, { replacements });
  return rows;
};

module.exports = { searchFlights, searchHotels, searchTrains, searchExperiences };