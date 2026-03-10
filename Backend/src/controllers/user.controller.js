const bcrypt = require("bcryptjs");
const User = require("../models/User");

/**
 * REGISTER (tạo user mới - mặc định USER)
 */
exports.register = async (req, res) => {
  try {
    const { Ho, Ten, Email, SDT, CCCD, Password } = req.body;

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
      Role: "USER"
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

    // USER chỉ xem chính mình
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
 * UPDATE user
 * USER: chỉ sửa thông tin cá nhân
 * ADMIN: sửa được cả Role
 */
exports.updateUser = async (req, res) => {
  try {

    const { id } = req.params;
    const { Ho, Ten, Email, SDT, CCCD, Password, Role } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Param id là bắt buộc"
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // USER chỉ sửa chính mình
    if (req.user.Role !== "ADMIN" && req.user.UserID != id) {
      return res.status(403).json({
        message: "Bạn chỉ được sửa thông tin của chính mình"
      });
    }

    // USER không được sửa Role
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

    // ADMIN mới sửa Role
    if (req.user.Role === "ADMIN") {
      user.Role = Role ?? user.Role;
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
 * chỉ ADMIN
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