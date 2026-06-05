const searchService = require("../services/search.service");

// Tìm chuyến bay
const searchFlights = async (req, res) => {
  try {
    const {
      from,
      to,
      date,
      returnDate,
      passengers,
      airline,
      seatClass,
      minPrice,
      maxPrice,
      priceMax,
      sortBy,
      sort,
      keyword,
      limit = 10,
      page = 1
    } = req.query;

    const parsedLimit = parseInt(limit) || 10;
    const parsedPage = parseInt(page) || 1;
    const offset = (parsedPage - 1) * parsedLimit;

    // Khứ hồi
    if (returnDate) {
      const outbound = await searchService.searchFlights({
        from,
        to,
        date,
        passengers,
        airline,
        seatClass,
        minPrice,
        maxPrice: maxPrice || priceMax,
        sortBy: sortBy || sort,
        keyword,
        limit: parsedLimit,
        offset
      });

      const returnFlights = await searchService.searchFlights({
        from: to,
        to: from,
        date: returnDate,
        passengers,
        airline,
        seatClass,
        minPrice,
        maxPrice: maxPrice || priceMax,
        sortBy: sortBy || sort,
        keyword,
        limit: parsedLimit,
        offset
      });

      return res.json({
        success: true,
        data: {
          outbound: outbound.data,
          return: returnFlights.data
        },
        total_items: outbound.total,
        total_pages: Math.ceil(outbound.total / parsedLimit),
        current_page: parsedPage
      });
    }

    // 1 chiều
    const result = await searchService.searchFlights({
      from,
      to,
      date,
      passengers,
      airline,
      seatClass,
      minPrice,
      maxPrice: maxPrice || priceMax,
      sortBy: sortBy || sort,
      keyword,
      limit: parsedLimit,
      offset
    });

    res.json({
      success: true,
      data: result.data,
      total_items: result.total,
      total_pages: Math.ceil(result.total / parsedLimit),
      current_page: parsedPage
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tìm khách sạn
const searchHotels = async (req, res) => {
  try {
    const {
      city,
      checkIn,
      checkOut,
      rating,
      star,
      minPrice,
      maxPrice,
      sortBy,
      sort,
      keyword,
      limit = 10,
      page = 1
    } = req.query;

    const parsedLimit = parseInt(limit) || 10;
    const parsedPage = parseInt(page) || 1;
    const offset = (parsedPage - 1) * parsedLimit;

    const result = await searchService.searchHotels({
      city,
      checkIn,
      checkOut,
      rating: rating || star,
      minPrice,
      maxPrice,
      sortBy: sortBy || sort,
      keyword,
      limit: parsedLimit,
      offset
    });

    res.json({
      success: true,
      data: result.data,
      total_items: result.total,
      total_pages: Math.ceil(result.total / parsedLimit),
      current_page: parsedPage
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tàu
const searchTrains = async (req, res) => {
  try {
    const { from, to, date, priceMax, sortBy } = req.query;
    const results = await searchService.searchTrains({ from, to, date, priceMax, sortBy });
    res.json({ success: true, data: results, total: results.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Trải nghiệm
const searchExperiences = async (req, res) => {
  try {
    const { destination, priceMax, sortBy, rating } = req.query;
    const results = await searchService.searchExperiences({ destination, priceMax, sortBy, rating });
    res.json({ success: true, data: results, total: results.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDestinations = async (req, res) => {
  try {
    const data = await searchService.getPopularDestinations();
    res.json({ success: true, data, total: data.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const { type = 'hotels', limit = 5, ...filters } = req.query;
    let data = [];

    if (type === 'hotels') {
      data = await searchService.recommendHotels({ ...filters, limit });
    } else if (type === 'flights') {
      data = await searchService.recommendFlights({ ...filters, limit });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Chỉ hỗ trợ recommendation cho type=hotels hoặc type=flights ở phiên bản này'
      });
    }

    res.json({
      success: true,
      data,
      total: data.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check phòng trống
const checkAvailability = async (req, res) => {
  try {
    const { hotelId, roomId, checkIn, checkOut, guests } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Thiếu ngày checkIn hoặc checkOut"
      });
    }

    const result = await searchService.checkHotelAvailability({
      hotelId,
      roomId,
      checkIn,
      checkOut,
      guests
    });

    res.json({
      success: true,
      available: result.available,
      rooms: result.rooms
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { searchFlights, searchHotels, getDestinations, getRecommendations, searchTrains, searchExperiences, checkAvailability };
