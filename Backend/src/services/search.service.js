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

const recommendHotels = async (params) => {
  const {
    city,
    rating,
    minPrice,
    maxPrice,
    keyword,
    limit = 5
  } = params;

  let query = `
    SELECT
      ks.MaKS,
      ks.TenKS AS name,
      ks.DiaChi AS address,
      ks.HangSao AS stars,
      AVG(lp.GiaPhong) AS min_price,
      COUNT(DISTINCT lp.MaLoaiPhong) AS room_count
    FROM KHACH_SAN ks
    LEFT JOIN LOAI_PHONG lp ON ks.MaKS = lp.MaKS
    WHERE 1=1
  `;

  const replacements = {};

  if (city) {
    query += ` AND ks.DiaChi LIKE :city`;
    replacements.city = `%${city}%`;
  }

  if (rating) {
    query += ` AND ks.HangSao >= :rating`;
    replacements.rating = rating;
  }

  if (minPrice) {
    query += ` AND lp.GiaPhong >= :minPrice`;
    replacements.minPrice = minPrice;
  }

  if (maxPrice) {
    query += ` AND lp.GiaPhong <= :maxPrice`;
    replacements.maxPrice = maxPrice;
  }

  if (keyword) {
    query += ` AND (ks.TenKS LIKE :keyword OR ks.DiaChi LIKE :keyword)`;
    replacements.keyword = `%${keyword}%`;
  }

  query += ` GROUP BY ks.MaKS, ks.TenKS, ks.DiaChi, ks.HangSao`;

  const [hotels] = await db.query(query, { replacements });

  const parsedMinPrice = minPrice ? Number(minPrice) : null;
  const parsedMaxPrice = maxPrice ? Number(maxPrice) : null;
  const avgPrice = parsedMinPrice !== null && parsedMaxPrice !== null
    ? (parsedMinPrice + parsedMaxPrice) / 2
    : null;

  const recommended = hotels
    .map((hotel) => {
      let score = 0;
      if (city && hotel.address.toLowerCase().includes(city.toLowerCase())) score += 30;
      if (keyword) {
        const keywordLower = keyword.toLowerCase();
        if (hotel.name.toLowerCase().includes(keywordLower)) score += 20;
        if (hotel.address.toLowerCase().includes(keywordLower)) score += 10;
      }
      score += hotel.stars * 12;
      if (hotel.min_price && parsedMaxPrice !== null && hotel.min_price <= parsedMaxPrice) score += 15;
      if (avgPrice !== null && hotel.min_price && hotel.min_price <= avgPrice) score += 10;
      if (hotel.room_count >= 5) score += 8;
      return { ...hotel, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, Number(limit));

  return recommended;
};

const popularDestinations = [
  {
    id: 1,
    name: 'Ha Noi',
    rating: 4.6,
    price: '752.000 VND',
    image: 'https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=1200&auto=format&fit=crop',
    subtitle: 'Flights & stays from 752.000 VND'
  },
  {
    id: 2,
    name: 'Da Nang',
    rating: 4.7,
    price: '814.000 VND',
    image: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?q=80&w=1200&auto=format&fit=crop',
    subtitle: 'Flights & stays from 814.000 VND'
  },
  {
    id: 3,
    name: 'Phu Quoc',
    rating: 4.8,
    price: '876.000 VND',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1200&auto=format&fit=crop',
    subtitle: 'Flights & stays from 876.000 VND'
  },
  {
    id: 4,
    name: 'HCM',
    rating: 4.9,
    price: '566.000 VND',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1200&auto=format&fit=crop',
    subtitle: 'Flights & stays from 566.000 VND'
  }
];

const getPopularDestinations = async () => {
  return popularDestinations;
};

const recommendFlights = async (params) => {
  const {
    from,
    to,
    date,
    passengers,
    airline,
    seatClass,
    minPrice,
    maxPrice,
    keyword,
    limit = 5
  } = params;

  const searchResult = await searchFlights({
    from,
    to,
    date,
    passengers,
    airline,
    seatClass,
    minPrice,
    maxPrice,
    keyword,
    sortBy: 'price',
    limit: 100,
    offset: 0
  });

  const parsedMinPrice = minPrice ? Number(minPrice) : null;
  const parsedMaxPrice = maxPrice ? Number(maxPrice) : null;

  const recommended = searchResult.data
    .map((flight) => {
      let score = 0;
      if (from && flight.from_code === from) score += 25;
      if (to && flight.to_code === to) score += 25;
      if (airline && flight.HangBay && flight.HangBay.toLowerCase().includes(airline.toLowerCase())) score += 20;
      if (keyword) {
        const keywordLower = keyword.toLowerCase();
        if (flight.from_name && flight.from_name.toLowerCase().includes(keywordLower)) score += 10;
        if (flight.to_name && flight.to_name.toLowerCase().includes(keywordLower)) score += 10;
        if (flight.HangBay && flight.HangBay.toLowerCase().includes(keywordLower)) score += 10;
      }
      if (parsedMaxPrice !== null && flight.price <= parsedMaxPrice) score += 10;
      if (parsedMinPrice !== null && flight.price >= parsedMinPrice) score += 5;
      score += Math.max(0, 10 - Math.floor(flight.price / 1000000));
      return { ...flight, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, Number(limit));

  return recommended;
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

module.exports = { searchFlights, searchHotels, recommendHotels, recommendFlights, searchTrains, searchExperiences, checkHotelAvailability, getPopularDestinations };
