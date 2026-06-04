const { ChuyenBay, TuyenDuong, SanBay, Ghe } = require("../models");

const includeRouteDetails = [
  {
    model: TuyenDuong,
    include: [
      {
        model: SanBay,
        as: "SanBayDi",
        attributes: ["Ten", "Code"]
      },
      {
        model: SanBay,
        as: "SanBayDen",
        attributes: ["Ten", "Code"]
      }
    ]
  }
];

exports.getFlights = async (req, res) => {
  try {
    const flights = await ChuyenBay.findAll({ include: includeRouteDetails });
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFlightDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const flight = await ChuyenBay.findByPk(id, {
      include: includeRouteDetails
    });

    if (!flight) {
      return res.status(404).json({
        message: "Flight not found"
      });
    }

    res.json(flight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFlightSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const seats = await Ghe.findAll({
      where: { MaChuyenBay: id },
      order: [['MaGhe', 'ASC']]
    });
    res.json({ success: true, data: seats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOrCreateRoute = async (originCode, destinationCode) => {
  let originAirport = await SanBay.findOne({ where: { Code: originCode } });
  if (!originAirport) {
    originAirport = await SanBay.create({ Code: originCode, Ten: `${originCode} Airport` });
  }

  let destinationAirport = await SanBay.findOne({ where: { Code: destinationCode } });
  if (!destinationAirport) {
    destinationAirport = await SanBay.create({ Code: destinationCode, Ten: `${destinationCode} Airport` });
  }

  let route = await TuyenDuong.findOne({
    where: {
      MaSanBayXuatPhat: originAirport.MaSanBay,
      MaSanBayDich: destinationAirport.MaSanBay
    }
  });

  if (!route) {
    route = await TuyenDuong.create({
      MaSanBayXuatPhat: originAirport.MaSanBay,
      MaSanBayDich: destinationAirport.MaSanBay
    });
  }

  return route.MaTuyenDuong;
};

exports.createFlight = async (req, res) => {
  try {
    const {
      MaTuyenDuong,
      origin,
      destination,
      HangBay,
      HangGhe,
      GiaCoBan,
      GioKhoiHanh,
      GioHaCanh
    } = req.body;

    let routeId = MaTuyenDuong;
    if (!routeId && origin && destination) {
      routeId = await getOrCreateRoute(origin, destination);
    }

    const flight = await ChuyenBay.create({
      MaTuyenDuong: routeId,
      HangBay,
      HangGhe,
      GiaCoBan,
      GioKhoiHanh,
      GioHaCanh
    });

    const fullFlight = await ChuyenBay.findByPk(flight.MaChuyenBay, {
      include: includeRouteDetails
    });

    res.status(201).json(fullFlight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      MaTuyenDuong,
      origin,
      destination,
      HangBay,
      HangGhe,
      GiaCoBan,
      GioKhoiHanh,
      GioHaCanh
    } = req.body;

    const flight = await ChuyenBay.findByPk(id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    let routeId = MaTuyenDuong;
    if (!routeId && origin && destination) {
      routeId = await getOrCreateRoute(origin, destination);
    }

    await flight.update({
      MaTuyenDuong: routeId || flight.MaTuyenDuong,
      HangBay,
      HangGhe,
      GiaCoBan,
      GioKhoiHanh,
      GioHaCanh
    });

    const fullFlight = await ChuyenBay.findByPk(id, {
      include: includeRouteDetails
    });

    res.json(fullFlight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const flight = await ChuyenBay.findByPk(id);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    await flight.destroy();
    res.json({ message: "Flight deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};