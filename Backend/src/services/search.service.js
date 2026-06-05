const { Sequelize } = require("sequelize");
const db = require("../configs/database");

const normalizeCity = (term) => {
  if (!term) return null;
  const normalized = term.toLowerCase().replace(/đ/g, 'd').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (normalized.includes('ha noi') || normalized.includes('hanoi')) return 'Ha Noi';
  if (normalized.includes('ho chi minh') || normalized.includes('saigon') || normalized.includes('hcm')) return 'Ho Chi Minh';
  if (normalized.includes('da nang') || normalized.includes('danang')) return 'Da Nang';
  if (normalized.includes('nha trang') || normalized.includes('cam ranh')) return 'Nha Trang';
  if (normalized.includes('phu quoc') || normalized.includes('phuquoc')) return 'Phu Quoc';
  if (normalized.includes('maldives')) return 'Maldives';
  return term; // Fallback
};

const getAirportCode = (term) => {
  if (!term) return null;
  const codeMatch = term.match(/\(([A-Z]{3})\)/);
  if (codeMatch) return codeMatch[1];
  const normalized = term.toLowerCase().replace(/đ/g, 'd').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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

  let baseQuery = `
    FROM KHACH_SAN ks
    LEFT JOIN LOAI_PHONG lp ON ks.MaKS = lp.MaKS
    WHERE 1=1
  `;

  const replacements = {};

  if (city) {
    const normalizedCity = normalizeCity(city);
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
      MIN(lp.GiaPhong) AS min_price,
      SUM(COALESCE(ttp.SoLuongPhongCoSan, 0)) AS available_rooms
    FROM KHACH_SAN ks
    LEFT JOIN LOAI_PHONG lp ON ks.MaKS = lp.MaKS
    LEFT JOIN TINH_TRANG_PHONG_TRONG ttp ON lp.MaLoaiPhong = ttp.MaLoaiPhong
    WHERE 1=1
  `;

  const replacements = {};
  query += ` GROUP BY ks.MaKS, ks.TenKS, ks.DiaChi, ks.HangSao`;

  const [hotels] = await db.query(query, { replacements });

  const parsedMinPrice = minPrice ? Number(minPrice) : null;
  const parsedMaxPrice = maxPrice ? Number(maxPrice) : null;

  const scoreHotel = (hotel) => {
    let score = 0;
    const hotelName = hotel.name ? hotel.name.toLowerCase() : '';
    const hotelAddress = hotel.address ? hotel.address.toLowerCase() : '';
    const cityLower = city ? city.toLowerCase() : '';
    const keywordLower = keyword ? keyword.toLowerCase() : '';

    if (city && (hotelAddress.includes(cityLower) || hotelName.includes(cityLower))) {
      score += 100;
    }

    if (keyword) {
      if (hotelName.includes(keywordLower)) score += 100;
      if (hotelAddress.includes(keywordLower)) score += 100;
    }

    if (hotel.min_price != null) {
      if (parsedMinPrice !== null && parsedMaxPrice !== null) {
        if (hotel.min_price >= parsedMinPrice && hotel.min_price <= parsedMaxPrice) score += 100;
      } else if (parsedMaxPrice !== null) {
        if (hotel.min_price <= parsedMaxPrice) score += 100;
      } else if (parsedMinPrice !== null) {
        if (hotel.min_price >= parsedMinPrice) score += 100;
      }
    }

    const availableRooms = Number(hotel.available_rooms || 0);
    score += Math.min(100, Math.max(0, availableRooms * 10));

    const stars = Number(hotel.stars || 0);
    if (stars >= 5) {
      score += 100;
    } else if (stars >= 3) {
      score += Math.round(((stars - 2) / 3) * 100);
    }

    if (hotel.flash_sale || hotel.is_flash_sale || hotel.promoActive) {
      score += 100;
    }

    return score;
  };

  const recommended = hotels
    .map((hotel) => ({
      ...hotel,
      available_rooms: Number(hotel.available_rooms || 0),
      score: scoreHotel(hotel)
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.min_price !== b.min_price) return (a.min_price || 0) - (b.min_price || 0);
      if (a.stars !== b.stars) return Number(b.stars) - Number(a.stars);
      return b.available_rooms - a.available_rooms;
    })
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
    airline,
    seatClass,
    minPrice,
    maxPrice,
    keyword,
    time,
    limit = 5
  } = params;

  const searchResult = await searchFlights({
    from,
    to,
    date,
    seatClass,
    keyword,
    sortBy: 'price',
    limit: 100,
    offset: 0
  });

  const parsedMinPrice = minPrice ? Number(minPrice) : null;
  const parsedMaxPrice = maxPrice ? Number(maxPrice) : null;

  const parseSearchTime = (value) => {
    if (!value) return null;
    if (!value.includes(':') && !value.includes('T')) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const searchDateTime = parseSearchTime(time);

  const recommended = searchResult.data
    .map((flight) => {
      let score = 0;
      if (from && flight.from_code === from) score += 50;
      if (to && flight.to_code === to) score += 50;
      if (airline && flight.HangBay && flight.HangBay.toLowerCase().includes(airline.toLowerCase())) score += 100;
      if (seatClass && flight.HangGhe === seatClass) score += 15;

      const keywordLower = keyword ? keyword.toLowerCase() : '';
      if (keywordLower) {
        if (flight.from_name && flight.from_name.toLowerCase().includes(keywordLower)) score += 50;
        if (flight.to_name && flight.to_name.toLowerCase().includes(keywordLower)) score += 50;
        if (flight.HangBay && flight.HangBay.toLowerCase().includes(keywordLower)) score += 100;
        if (from && flight.from_code === from) score += 25;
        if (to && flight.to_code === to) score += 25;
        if (airline && flight.HangBay && flight.HangBay.toLowerCase().includes(airline.toLowerCase())) score += 20;
      }

      if (flight.price != null) {
        if (parsedMinPrice !== null && parsedMaxPrice !== null) {
          if (flight.price >= parsedMinPrice && flight.price <= parsedMaxPrice) score += 100;
        } else if (parsedMaxPrice !== null) {
          if (flight.price <= parsedMaxPrice) score += 100;
        } else if (parsedMinPrice !== null) {
          if (flight.price >= parsedMinPrice) score += 100;
        }
      }

      if (flight.rating != null) {
        const ratingValue = Number(flight.rating);
        if (!Number.isNaN(ratingValue)) {
          if (ratingValue >= 5) {
            score += 100;
          } else if (ratingValue >= 3) {
            score += Math.round(((ratingValue - 2) / 3) * 100);
          }
        }
      }

      const isDirect = flight.stops === 0 || flight.direct === true || (!('stops' in flight) && !('direct' in flight));
      if (isDirect) score += 100;

      if (searchDateTime && flight.departure_time) {
        const departureTime = new Date(flight.departure_time);
        if (!Number.isNaN(departureTime.getTime())) {
          const diffHours = Math.abs(departureTime - searchDateTime) / (1000 * 60 * 60);
          if (diffHours <= 0.5) {
            score += 100;
          } else if (diffHours <= 1) {
            score += 50;
          } else {
            score += Math.max(0, 50 - Math.floor(diffHours - 1) * 10);
          }
        }
      }

      if (flight.flash_sale || flight.is_flash_sale || flight.promoActive) {
        score += 100;
      }

      return { ...flight, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.price !== b.price) return a.price - b.price;
      if (a.departure_time && b.departure_time) return new Date(a.departure_time) - new Date(b.departure_time);
      return 0;
    })
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
// ─── Helper: Tính rating từ MaDV (giống frontend) ───
const generateStarsFromId = (maDV) => {
  const hash = Math.abs(maDV * 2654435761) % 100;
  if (hash < 20) return 5;
  if (hash < 40) return 4;
  if (hash < 60) return 3;
  if (hash < 80) return 4;
  return 5;
};

const calculateDisplayRating = (stars, seed) => {
  const clampedStars = Math.max(1, Math.min(5, Math.round(stars)));
  const random = (s) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  const randomValue = random(seed);
  
  let min, max;
  switch (clampedStars) {
    case 5: min = 4.5; max = 5.0; break;
    case 4: min = 3.5; max = 4.4; break;
    case 3: min = 2.5; max = 3.4; break;
    case 2: min = 1.5; max = 2.4; break;
    case 1:
    default: min = 0.5; max = 1.4;
  }
  const displayRating = min + (max - min) * randomValue;
  return Math.round(displayRating * 10) / 10;
};

const searchExperiences = async ({ destination, priceMax, sortBy, rating }) => {
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
    const normalizedDest = normalizeCity(destination);
    query += ` AND (dl.DiaDiemThamQuan LIKE :dest OR dl.DiemDon LIKE :dest)`;
    replacements.dest = `%${normalizedDest}%`;
  }
  if (priceMax) { query += ` AND dv.Gia <= :priceMax`; replacements.priceMax = priceMax; }

  query += ` ORDER BY dv.Gia ASC`;

  const [rows] = await db.query(query, { replacements });
  
  // Filter theo rating nếu có
  if (rating && typeof rating === 'string' && rating.trim()) {
    const selectedStars = rating.split(',').map(s => parseInt(s, 10)).filter(s => !isNaN(s));
    if (selectedStars.length > 0) {
      return rows.filter(row => {
        const stars = generateStarsFromId(row.MaDV);
        return selectedStars.includes(stars);
      });
    }
  }
  
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

const getActivePromotions = async () => {
  const query = `
    SELECT * 
    FROM khuyen_mai 
    WHERE TrangThaiKM = 'ACTIVE'
      AND (NgayApDung IS NULL OR NgayApDung <= NOW())
      AND (NgayKetThuc IS NULL OR NgayKetThuc >= NOW())
  `;
  const [rows] = await db.query(query);
  
  return rows.map(row => {
    let parsedDieuKien = {};
    try {
      parsedDieuKien = row.DieuKien ? JSON.parse(row.DieuKien) : {};
    } catch (e) {
      console.error("Failed to parse DieuKien JSON:", e);
    }
    return {
      id: row.MaKM,
      title: row.TenKM,
      code: row.TenKM,
      type: row.LoaiKM,
      startDate: row.NgayApDung,
      endDate: row.NgayKetThuc,
      status: row.TrangThaiKM,
      ...parsedDieuKien
    };
  });
};

const seedPromotionsOnStartup = async () => {
  try {
    const [existing] = await db.query("SELECT COUNT(*) as count FROM khuyen_mai WHERE LoaiKM IN ('PROMO', 'COUPON')");
    if (existing[0].count === 0) {
      console.log('No promotions found. Seeding promotions automatically...');
      await db.query(`
        INSERT INTO khuyen_mai (TenKM, LoaiKM, NgayApDung, NgayKetThuc, DieuKien, TrangThaiKM) VALUES 
        ('Up to 20% Off\\nDining Vouchers', 'PROMO', '2026-06-01', '2026-12-31', 
         '{"badge": "LIMITED TIME", "badgeColor": "yellow", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCUh0E7h4kKz315MnHIzv_UTPH9iYSAgKp5u59CVwebESS8qSBsR-xoVQ2FnLHoG5zZJl_Fogvhc8S0JhBWbxmRMBY0e2ehHNkC1z1VcRZGaNtQxLDWBvFPsZxf9nlwpRZ4fC5oBPlOw-cT8QWF6VVE7zimKRvocqbiKSv5f4cA9S9W8vrQIgFuW7Yk5ktPwbIWZaPyOG527-J3nX-IawG9l7rUMl5xXTHdd5FRn9LzMkLbuXDkUyImJ5mM6g3gCN9PAqVNmcLU47c", "targetUrl": "/experience"}', 
         'ACTIVE'),

        ('International Flights\\nStarting from $199', 'PROMO', '2026-06-01', '2026-12-31', 
         '{"badge": "FLIGHT DEAL", "badgeColor": "blue", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAMv7gS5O3bc8_67hLa_ydpldx0r7L-BjMVVuBXmPyPgxNAKGl4T3lEVXH7yom2ylDE7ZXpw0ydLkviVAoRUd3fiznhTZOp1e_anYolCVExsN7jbxyhTLXMBiuIIsrjUTR1rSLBebaqGKiWZ57YKgfPR-owgYKTWy1qgRIoFXWfU7YIMmjoBYyH7qnu0j629oPlTus3NFbKsejq68LMsWL2MnMHMmI2TFvTAgPLJkHPb0SJvQoQZNRzy3xC3MbkUjXzR81uOH4M0-g", "targetUrl": "/flights"}', 
         'ACTIVE'),

        ('Weekend Getaway\\nPackages', 'PROMO', '2026-06-01', '2026-12-31', 
         '{"badge": "STAYCATION", "badgeColor": "purple", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAOUxGIqRVbUdCmNozeycTjPhDt_WulULzmrpwAYNT23GLnTpMZIjQx3_lMKlzxDiPhxyoPNv94FFLJ1h5LsFyBY9HCq9S1hDbYRY4rn8cJQUil7v5O8Ii3aJSaS5-tLEvLTVfgYcbBKlyuGWlxWvtpPur_Vl4dqHseFqq9iJIkY4t1srjZcnCy0hJyD_el7_KKlhpACaERsV-cfTdy2YQ-KFLzUobD6DqOpaGzJIm44DDbz1bmqcOOD4IUT7525OZGvfKAZTKNxE0", "targetUrl": "/hotels"}', 
         'ACTIVE'),

        ('FLYHIGH', 'COUPON', '2026-06-01', '2026-12-31', 
         '{"title": "International Flights", "discount": "Save $50", "terms": "Min. spend $500 • Valid until Dec 31", "icon": "flight_takeoff", "color": "blue"}', 
         'ACTIVE'),

        ('STAYLUXE', 'COUPON', '2026-06-01', '2026-12-31', 
         '{"title": "First Hotel Booking", "discount": "15% OFF", "terms": "Max discount $30 • New users only", "icon": "hotel", "color": "orange"}', 
         'ACTIVE'),

        ('FUNTIME', 'COUPON', '2026-06-01', '2026-12-31', 
         '{"title": "Xperience Activity", "discount": "10% Back", "terms": "Cashback in points • All activities", "icon": "local_activity", "color": "purple"}', 
         'ACTIVE')
      `);
      console.log('Promotions seeded successfully!');
    }
  } catch (error) {
    console.error('Error auto-seeding promotions:', error);
  }
};

setTimeout(seedPromotionsOnStartup, 1000);

module.exports = { searchFlights, searchHotels, recommendHotels, recommendFlights, searchTrains, searchExperiences, checkHotelAvailability, getPopularDestinations, getActivePromotions };
