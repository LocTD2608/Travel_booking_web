const searchService = require("../services/search.service");

const searchFlights = async (req, res) => {
  try {
    const { from, to } = req.query;

    console.log("FROM:", from);
    console.log("TO:", to);

    const flights = await searchService.searchFlights(from, to);

    res.json(flights);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const searchHotels = async (req, res) => {
  try {
    const { city } = req.query;

    const hotels = await searchService.searchHotels(city);

    res.json(hotels);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  searchFlights,
  searchHotels
};