const { ChuyenBay, TuyenDuong, SanBay } = require("../models");

exports.getFlightDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const flight = await ChuyenBay.findByPk(id, {
      include: [
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
      ]
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