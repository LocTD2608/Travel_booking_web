const bcrypt = require("bcryptjs");
const { User } = require("../models");

/**
 * REGISTER (tạo user mới - mặc định USER)
 */
exports.register = async (req, res) => {
  try {

    const {
      Ho,
      Ten,
      Email,
      SDT,
      CCCD,
      Password,
      TrangThai,
      TinhTrangXacMinh
    } = req.body;

    if (!Ho || !Ten || !Email || !Password) {
      return res.status(400).json({
        message: "Ho, Ten, Email và Password là bắt buộc"
      });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const user = await User.create({
      Ho,
      Ten,
      Email,
      SDT,
      CCCD,
      Password: hashedPassword,
      Role: "USER",
      TrangThai: TrangThai || "ACTIVE",
      TinhTrangXacMinh: TinhTrangXacMinh || "UNVERIFIED"
    });

    res.status(201).json({
      message: "User created",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * ADMIN: xem toàn bộ users
 */
exports.getAllUsers = async (req, res) => {
  try {

    if (req.user.Role !== "ADMIN") {
      return res.status(403).json({
        message: "Chỉ Admin được phép xem toàn bộ user"
      });
    }

    const users = await User.findAll({
      attributes: { exclude: ["Password"] }
    });

    res.json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * USER xem chính mình / ADMIN xem bất kỳ
 */
exports.getUserById = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Param id là bắt buộc"
      });
    }

    if (req.user.Role !== "ADMIN" && req.user.UserID != id) {
      return res.status(403).json({
        message: "Bạn chỉ được xem thông tin của chính mình"
      });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ["Password"] }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * UPDATE USER
 */
exports.updateUser = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      Ho,
      Ten,
      Email,
      SDT,
      CCCD,
      Password,
      Role,
      TrangThai,
      TinhTrangXacMinh
    } = req.body;

    // Validate CCCD
    const cccdRegex = /^\d{12}$/;
    if (CCCD && !cccdRegex.test(CCCD)) {
      return res.status(400).json({
        message: "CCCD phải gồm đúng 12 chữ số"
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (req.user.Role !== "ADMIN" && req.user.UserID != id) {
      return res.status(403).json({
        message: "Bạn chỉ được sửa thông tin của chính mình"
      });
    }

    if (req.user.Role !== "ADMIN" && Role) {
      return res.status(403).json({
        message: "User không được phép thay đổi Role"
      });
    }

    if (Password) {
      user.Password = await bcrypt.hash(Password, 10);
    }

    user.Ho = Ho ?? user.Ho;
    user.Ten = Ten ?? user.Ten;
    user.Email = Email ?? user.Email;
    user.SDT = SDT ?? user.SDT;
    user.CCCD = CCCD ?? user.CCCD;

    // ADMIN mới sửa các field này
    if (req.user.Role === "ADMIN") {
      user.Role = Role ?? user.Role;
      user.TrangThai = TrangThai ?? user.TrangThai;
      user.TinhTrangXacMinh = TinhTrangXacMinh ?? user.TinhTrangXacMinh;
    }

    await user.save();

    res.json({
      message: "Updated successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * DELETE USER
 */
exports.deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    if (req.user.Role !== "ADMIN") {
      return res.status(403).json({
        message: "Chỉ Admin được phép xóa user"
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    await User.destroy({
      where: { UserID: id }
    });

    res.json({
      message: "User deleted permanently"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};