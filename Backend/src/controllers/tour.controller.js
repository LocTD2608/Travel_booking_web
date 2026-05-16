const { DichVu, DV_DU_LICH } = require("../models");
const { Op } = require("sequelize");

// Lấy tất cả tour du lịch
exports.getAllTours = async (req, res) => {
  try {
    const tours = await DichVu.findAll({
      where: { LoaiDichVu: "du_lich" },
      include: [
        {
          model: DV_DU_LICH,
          as: "TourDetails",
          required: false
        }
      ]
    });

    if (!tours || tours.length === 0) {
      return res.status(404).json({
        message: "No tours found"
      });
    }

    res.json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết tour du lịch
exports.getTourDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await DichVu.findByPk(id, {
      include: [
        {
          model: DV_DU_LICH,
          as: "TourDetails",
          required: false
        }
      ]
    });

    if (!tour) {
      return res.status(404).json({
        message: "Tour not found"
      });
    }

    // Chỉ trả về nếu là tour du lịch
    if (tour.LoaiDichVu !== "du_lich") {
      return res.status(404).json({
        message: "This is not a travel tour"
      });
    }

    res.json({
      success: true,
      data: tour
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tìm kiếm tour theo điểm đón hoặc địa điểm tham quan
exports.searchTours = async (req, res) => {
  try {
    const { diemDon, diaDiemThamQuan, minPrice, maxPrice } = req.query;

    let where = { LoaiDichVu: "du_lich" };
    let dvWhere = {};

    if (minPrice || maxPrice) {
      where.Gia = {};
      if (minPrice) where.Gia[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.Gia[Op.lte] = parseFloat(maxPrice);
    }

    if (diemDon) {
      dvWhere.DiemDon = { [Op.like]: `%${diemDon}%` };
    }

    if (diaDiemThamQuan) {
      dvWhere.DiaDiemThamQuan = { [Op.like]: `%${diaDiemThamQuan}%` };
    }

    const tours = await DichVu.findAll({
      where,
      include: [
        {
          model: DV_DU_LICH,
          as: "TourDetails",
          where: Object.keys(dvWhere).length > 0 ? dvWhere : undefined,
          required: Object.keys(dvWhere).length > 0
        }
      ]
    });

    if (!tours || tours.length === 0) {
      return res.status(404).json({
        message: "No tours match your search criteria"
      });
    }

    res.json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tour theo giá tiền
exports.getToursByPrice = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    if (!minPrice || !maxPrice) {
      return res.status(400).json({
        message: "minPrice and maxPrice are required"
      });
    }

    const tours = await DichVu.findAll({
      where: {
        LoaiDichVu: "du_lich",
        Gia: {
          [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
        }
      },
      include: [
        {
          model: DV_DU_LICH,
          as: "TourDetails",
          required: false
        }
      ],
      order: [["Gia", "ASC"]]
    });

    if (!tours || tours.length === 0) {
      return res.status(404).json({
        message: "No tours found in that price range"
      });
    }

    res.json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tour theo điểm đón
exports.getToursByPickup = async (req, res) => {
  try {
    const { diemDon } = req.query;

    if (!diemDon) {
      return res.status(400).json({
        message: "diemDon (pickup point) is required"
      });
    }

    const tours = await DichVu.findAll({
      where: { LoaiDichVu: "du_lich" },
      include: [
        {
          model: DV_DU_LICH,
          as: "TourDetails",
          where: {
            DiemDon: { [Op.like]: `%${diemDon}%` }
          },
          required: true
        }
      ]
    });

    if (!tours || tours.length === 0) {
      return res.status(404).json({
        message: `No tours found with pickup point: ${diemDon}`
      });
    }

    res.json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tour theo địa điểm tham quan
exports.getToursByDestination = async (req, res) => {
  try {
    const { diaDiemThamQuan } = req.query;

    if (!diaDiemThamQuan) {
      return res.status(400).json({
        message: "diaDiemThamQuan (destination) is required"
      });
    }

    const tours = await DichVu.findAll({
      where: { LoaiDichVu: "du_lich" },
      include: [
        {
          model: DV_DU_LICH,
          as: "TourDetails",
          where: {
            DiaDiemThamQuan: { [Op.like]: `%${diaDiemThamQuan}%` }
          },
          required: true
        }
      ]
    });

    if (!tours || tours.length === 0) {
      return res.status(404).json({
        message: `No tours found for destination: ${diaDiemThamQuan}`
      });
    }

    res.json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
