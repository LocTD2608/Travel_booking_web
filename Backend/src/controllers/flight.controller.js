const { ChuyenBay, TuyenDuong, SanBay } = require("../models");

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

exports.createFlight = async (req, res) => {
  try {
    const {
      MaTuyenDuong,
      HangBay,
      HangGhe,
      GiaCoBan,
      GioKhoiHanh,
      GioHaCanh
    } = req.body;

    const flight = await ChuyenBay.create({
      MaTuyenDuong,
      HangBay,
      HangGhe,
      GiaCoBan,
      GioKhoiHanh,
      GioHaCanh
    });

    res.status(201).json(flight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      MaTuyenDuong,
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

    await flight.update({
      MaTuyenDuong,
      HangBay,
      HangGhe,
      GiaCoBan,
      GioKhoiHanh,
      GioHaCanh
    });

    res.json(flight);
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