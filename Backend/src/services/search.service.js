const { Sequelize } = require("sequelize");
const db = require("../configs/database");

const getAirportCode = (term) => {
  if (!term) return null;
  const codeMatch = term.match(/\(([A-Z]{3})\)/);
  if (codeMatch) return codeMatch[1];
  const normalized = term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (normalized.includes('ha noi') || normalized.includes('hanoi') || normalized.includes('han')) return 'HAN';
  if (normalized.includes('ho chi minh') || normalized.includes('saigon') || normalized.includes('sgn')) return 'SGN';
  if (normalized.includes('da nang') || normalized.includes('danang') || normalized.includes('dad')) return 'DAD';
  if (normalized.includes('nha trang') || normalized.includes('cam ranh') || normalized.includes('cxr')) return 'CXR';
  if (normalized.includes('phu quoc') || normalized.includes('pqc')) return 'PQC';
  if (normalized.includes('hue') || normalized.includes('phu bai') || normalized.includes('hui')) return 'HUI';
  if (normalized.includes('can tho') || normalized.includes('vca')) return 'VCA';
  if (normalized.includes('dong hoi') || normalized.includes('vdh')) return 'VDH';
  if (normalized.includes('chu lai') || normalized.includes('quang nam') || normalized.includes('vcl')) return 'VCL';
  if (normalized.includes('quy nhon') || normalized.includes('phu cat') || normalized.includes('binh dinh') || normalized.includes('uih')) return 'UIH';
  return null;
};

// ─── FLIGHTS ─────────────────────────────────────────────────────────────────
const searchFlights = async (params) => {
  const {
    from,
    to,
    date,
    passengers,
    airline,
    seatClass,
    minPrice,
    maxPrice,
    sortBy,
    keyword,
    limit = 10,
    offset = 0
  } = params;

  let baseQuery = `
    FROM CHUYEN_BAY cb
    JOIN TUYEN_DUONG td ON cb.MaTuyenDuong = td.MaTuyenDuong
    JOIN SAN_BAY sb1 ON td.MaSanBayXuatPhat = sb1.MaSanBay
    JOIN SAN_BAY sb2 ON td.MaSanBayDich     = sb2.MaSanBay
    WHERE 1=1
  `;

  const replacements = {};

  if (from) { 
    const fromCode = getAirportCode(from);
    if (fromCode) {
      baseQuery += ` AND (sb1.Code = :fromCode OR sb1.Ten LIKE :from)`; 
      replacements.fromCode = fromCode;
    } else {
      baseQuery += ` AND (sb1.Code LIKE :from OR sb1.Ten LIKE :from)`; 
    }
    replacements.from = `%${from}%`; 
  }
  if (to) { 
    const toCode = getAirportCode(to);
    if (toCode) {
      baseQuery += ` AND (sb2.Code = :toCode OR sb2.Ten LIKE :to)`; 
      replacements.toCode = toCode;
    } else {
      baseQuery += ` AND (sb2.Code LIKE :to OR sb2.Ten LIKE :to)`; 
    }
    replacements.to = `%${to}%`; 
  }
  if (date) { baseQuery += ` AND DATE(cb.GioKhoiHanh) = :date`; replacements.date = date; }
  if (airline) { baseQuery += ` AND cb.HangBay LIKE :airline`; replacements.airline = `%${airline}%`; }
  if (seatClass) { baseQuery += ` AND cb.HangGhe = :seatClass`; replacements.seatClass = seatClass; }
  if (minPrice) { baseQuery += ` AND cb.GiaCoBan >= :minPrice`; replacements.minPrice = minPrice; }
  if (maxPrice) { baseQuery += ` AND cb.GiaCoBan <= :maxPrice`; replacements.maxPrice = maxPrice; }

  if (passengers) {
    baseQuery += ` AND cb.SoGheCon >= :passengers`;
    replacements.passengers = passengers;
  }

  if (keyword) {
    baseQuery += `
      AND (
        sb1.Ten LIKE :keyword OR
        sb2.Ten LIKE :keyword OR
        cb.HangBay LIKE :keyword
      )
    `;
    replacements.keyword = `%${keyword}%`;
  }

  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
  const [[countResult]] = await db.query(countQuery, { replacements });

  const orderMap = {
    price: 'cb.GiaCoBan',
    departure: 'cb.GioKhoiHanh'
  };

  const dataQuery = `
    SELECT
      cb.MaChuyenBay,
      sb1.Code AS from_code,
      sb1.Ten  AS from_name,
      sb2.Code AS to_code,
      sb2.Ten  AS to_name,
      cb.HangBay,
      cb.HangGhe,
      cb.GiaCoBan AS price,
      cb.GioKhoiHanh AS departure_time,
      cb.GioHaCanh AS arrival_time
    ${baseQuery}
    ORDER BY ${orderMap[sortBy] || 'cb.GiaCoBan'} ASC
    LIMIT :limit OFFSET :offset
  `;

  replacements.limit = parseInt(limit);
  replacements.offset = parseInt(offset);

  const [rows] = await db.query(dataQuery, { replacements });

  return {
    data: rows,
    total: countResult.total
  };
};

// ─── HOTELS ──────────────────────────────────────────────────────────────────
const searchHotels = async (params) => {
  const {
    city,
    checkIn,
    checkOut,
    rating,
    minPrice,
    maxPrice,
    sortBy,
    keyword,
    limit = 10,
    offset = 0
  } = params;

  const normalizeCityForHotel = (term) => {
    if (!term) return null;
    const normalized = term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normalized.includes('ha noi') || normalized.includes('hanoi')) return 'Ha Noi';
    if (normalized.includes('ho chi minh') || normalized.includes('saigon') || normalized.includes('hcm')) return 'HCM';
    if (normalized.includes('da nang') || normalized.includes('danang')) return 'Da Nang';
    if (normalized.includes('nha trang') || normalized.includes('cam ranh')) return 'Nha Trang';
    if (normalized.includes('phu quoc') || normalized.includes('phuquoc')) return 'Phu Quoc';
    return term; // Fallback
  };

  let baseQuery = `
    FROM KHACH_SAN ks
    LEFT JOIN LOAI_PHONG lp ON ks.MaKS = lp.MaKS
    WHERE 1=1
  `;

  const replacements = {};

  if (city) { 
    const normalizedCity = normalizeCityForHotel(city);
    baseQuery += ` AND ks.DiaChi LIKE :city`; 
    replacements.city = `%${normalizedCity}%`; 
  }
  if (rating) { baseQuery += ` AND ks.HangSao >= :rating`; replacements.rating = rating; }
  if (minPrice) { baseQuery += ` AND lp.GiaPhong >= :minPrice`; replacements.minPrice = minPrice; }
  if (maxPrice) { baseQuery += ` AND lp.GiaPhong <= :maxPrice`; replacements.maxPrice = maxPrice; }

  if (keyword) {
    baseQuery += `
      AND (
        ks.TenKS LIKE :keyword OR
        ks.DiaChi LIKE :keyword
      )
    `;
    replacements.keyword = `%${keyword}%`;
  }

  if (checkIn && checkOut) {
    baseQuery += `
      AND EXISTS (
        SELECT 1
        FROM LOAI_PHONG lp2
        WHERE lp2.MaKS = ks.MaKS
        AND (
          lp2.SoLuongPhong - (
            SELECT COUNT(*)
            FROM DAT_PHONG dp
            WHERE dp.MaLoaiPhong = lp2.MaLoaiPhong
            AND NOT (
              dp.NgayTra <= :checkIn OR dp.NgayNhan >= :checkOut
            )
          )
        ) > 0
      )
    `;
    replacements.checkIn = checkIn;
    replacements.checkOut = checkOut;
  }

  const countQuery = `SELECT COUNT(DISTINCT ks.MaKS) as total ${baseQuery}`;
  const [[countResult]] = await db.query(countQuery, { replacements });

  const dataQuery = `
    SELECT
      ks.MaKS,
      ks.TenKS   AS name,
      ks.DiaChi  AS address,
      ks.HangSao AS stars,
      MIN(lp.GiaPhong) AS min_price
    ${baseQuery}
    GROUP BY ks.MaKS, ks.TenKS, ks.DiaChi, ks.HangSao
    ORDER BY ${sortBy === 'rating' ? 'ks.HangSao DESC' : 'min_price ASC'}
    LIMIT :limit OFFSET :offset
  `;

  replacements.limit = parseInt(limit);
  replacements.offset = parseInt(offset);

  const [rows] = await db.query(dataQuery, { replacements });

  return {
    data: rows,
    total: countResult.total
  };
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

// Check phòng trống
const checkHotelAvailability = async ({ hotelId, roomId, checkIn, checkOut, guests }) => {
  const replacements = { hotelId, roomId, checkIn, checkOut };

  let query = `
    SELECT 
      lp.MaLoaiPhong,
      lp.MaKS,
      lp.SoLuongPhong,
      (
        lp.SoLuongPhong - (
          SELECT COUNT(*)
          FROM DAT_PHONG dp
          WHERE dp.MaLoaiPhong = lp.MaLoaiPhong
          AND NOT (
            dp.NgayTra <= :checkIn OR dp.NgayNhan >= :checkOut
          )
        )
      ) AS rooms_left
    FROM LOAI_PHONG lp
    WHERE 1=1
  `;

  if (hotelId) {
    query += ` AND lp.MaKS = :hotelId`;
  }

  if (roomId) {
    query += ` AND lp.MaLoaiPhong = :roomId`;
  }

  if (guests) {
    query += ` AND lp.SoNguoiToiDa >= :guests`;
    replacements.guests = guests;
  }

  const [rows] = await db.query(query, { replacements });

  const availableRooms = rows.filter(r => r.rooms_left > 0);

  return {
    available: availableRooms.length > 0,
    rooms: availableRooms
  };
};

module.exports = { searchFlights, searchHotels, searchTrains, searchExperiences, checkHotelAvailability };
