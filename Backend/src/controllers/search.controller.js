const searchService = require("../services/search.service");

// Tìm chuyến bay
const searchFlights = async (req, res) => {
  try {
    const {
      from,
      to,
      date,
      passengers,
      airline,
      seatClass,
      minPrice,
      maxPrice,
      priceMax,
      sortBy,
      sort
    } = req.query;

    const results = await searchService.searchFlights({
      from,
      to,
      date,
      passengers,
      airline,
      seatClass,
      minPrice,
      maxPrice: maxPrice || priceMax,
      sortBy: sortBy || sort,
    });

    res.json({ success: true, data: results, total: results.length });
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
      sort
    } = req.query;

    const results = await searchService.searchHotels({
      city,
      checkIn,
      checkOut,
      rating: rating || star,
      minPrice,
      maxPrice,
      sortBy: sortBy || sort,
    });

    res.json({ success: true, data: results, total: results.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchTrains = async (req, res) => {
  try {
    const { from, to, date, priceMax, sortBy } = req.query;
    const results = await searchService.searchTrains({ from, to, date, priceMax, sortBy });
    res.json({ success: true, data: results, total: results.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchExperiences = async (req, res) => {
  try {
    const { destination, priceMax, sortBy } = req.query;
    const results = await searchService.searchExperiences({ destination, priceMax, sortBy });
    res.json({ success: true, data: results, total: results.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { searchFlights, searchHotels, searchTrains, searchExperiences };
