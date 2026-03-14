const searchService = require("../services/search.service");

// Tìm chuyến bay
const searchFlights = async (req, res) => {
  try {
    const {
      from,
      to,
      airline,
      seatClass,
      minPrice,
      maxPrice,
      sort
    } = req.query;

    const flights = await searchService.searchFlights(
      from,
      to,
      airline,
      seatClass,
      minPrice,
      maxPrice,
      sort,
    );

    res.json(flights);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Tìm khách sạn
const searchHotels = async (req, res) => {
  try {
    const {
      city,
      star,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const hotels = await searchService.searchHotels(
      city,
      star,
      minPrice,
      maxPrice,
      sort,
    );

    res.json(hotels);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  searchFlights,
  searchHotels,
};