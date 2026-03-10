const searchService = require("../services/search.service");

const searchFlights = async (req, res) => {
  try {
    const { from, to, date, passengers, priceMax, sortBy } = req.query;
    const results = await searchService.searchFlights({ from, to, date, passengers, priceMax, sortBy });
    res.json({ success: true, data: results, total: results.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchHotels = async (req, res) => {
  try {
    const { city, checkIn, checkOut, rating, sortBy } = req.query;
    const results = await searchService.searchHotels({ city, checkIn, checkOut, rating, sortBy });
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