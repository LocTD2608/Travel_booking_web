const bcrypt = require("bcryptjs");
const User = require("../models/User");

/**
 * CREATE user (Admin)
 */
exports.createUser = async (req, res) => {
  try {
    const { Ho, Ten, Email, SDT, CCCD, Password, Role } = req.body;

    // Validate bắt buộc
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
      Role,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * READ all users (Admin)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["Password"] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * READ user by ID (User/Admin)
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["Password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * UPDATE user
 */
exports.updateUser = async (req, res) => {
  try {
    const { Ho, Ten, SDT, CCCD, Password } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (Password) {
      user.Password = await bcrypt.hash(Password, 10);
    }

    user.Ho = Ho ?? user.Ho;
    user.Ten = Ten ?? user.Ten;
    user.SDT = SDT ?? user.SDT;
    user.CCCD = CCCD ?? user.CCCD;

    await user.save();
    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE user (hard delete)
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.destroy({
      where: { UserID: id }
    });

    res.json({ message: "User deleted permanently" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
