const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/accommodations.json");

// Helper to read data
const readData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const raw = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading accommodations database:", error);
    return [];
  }
};

// Helper to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing accommodations database:", error);
  }
};

// ─── Accommodations CRUD ──────────────────────────────────────────────────────

exports.getAccommodations = async (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy danh sách cơ sở lưu trú", error: error.message });
  }
};

exports.getAccommodationById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = readData();
    const item = data.find((a) => a.id === id);
    if (!item) {
      return res.status(404).json({ message: "Không tìm thấy cơ sở lưu trú" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
  }
};

exports.createAccommodation = async (req, res) => {
  try {
    const { name, location, type, rating, pricePerNight, totalRooms, description, imageUrl, status } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({ message: "Tên và địa điểm là bắt buộc" });
    }

    const data = readData();
    const newId = "a" + Date.now();
    const newAcc = {
      id: newId,
      name,
      location,
      type: type || "Hotel",
      rating: parseFloat(rating) || 4,
      pricePerNight: parseFloat(pricePerNight) || 0,
      totalRooms: parseInt(totalRooms) || 0,
      availableRooms: parseInt(totalRooms) || 0,
      status: status || "active",
      description: description || "",
      imageUrl: imageUrl || "",
      rooms: []
    };

    data.unshift(newAcc);
    writeData(data);

    res.status(201).json(newAcc);
  } catch (error) {
    res.status(500).json({ message: "Không thể tạo cơ sở lưu trú", error: error.message });
  }
};

exports.updateAccommodation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const data = readData();
    
    const index = data.findIndex((a) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Không tìm thấy cơ sở lưu trú" });
    }

    const existing = data[index];
    const updatedAcc = {
      ...existing,
      ...updates,
      // Đảm bảo không ghi đè ID và giữ nguyên rooms nếu không được truyền trực tiếp
      id: existing.id,
      rooms: updates.rooms !== undefined ? updates.rooms : existing.rooms
    };

    // Cập nhật lại số lượng phòng trống nếu số phòng đổi
    if (updates.totalRooms !== undefined && updates.rooms === undefined) {
      const diff = parseInt(updates.totalRooms) - existing.totalRooms;
      updatedAcc.availableRooms = Math.max(0, existing.availableRooms + diff);
    }

    data[index] = updatedAcc;
    writeData(data);

    res.json(updatedAcc);
  } catch (error) {
    res.status(500).json({ message: "Không thể cập nhật cơ sở lưu trú", error: error.message });
  }
};

exports.deleteAccommodation = async (req, res) => {
  try {
    const { id } = req.params;
    let data = readData();
    
    const exists = data.some((a) => a.id === id);
    if (!exists) {
      return res.status(404).json({ message: "Không tìm thấy cơ sở lưu trú" });
    }

    data = data.filter((a) => a.id !== id);
    writeData(data);

    res.json({ success: true, message: "Đã xóa cơ sở lưu trú thành công" });
  } catch (error) {
    res.status(500).json({ message: "Không thể xóa cơ sở lưu trú", error: error.message });
  }
};

// ─── Rooms CRUD ───────────────────────────────────────────────────────────────

exports.getRooms = async (req, res) => {
  try {
    const { id } = req.params; // accommodation id
    const data = readData();
    const acc = data.find((a) => a.id === id);
    if (!acc) {
      return res.status(404).json({ message: "Không tìm thấy cơ sở lưu trú" });
    }
    res.json(acc.rooms || []);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy danh sách phòng", error: error.message });
  }
};

exports.addRoom = async (req, res) => {
  try {
    const { id } = req.params; // accommodation id
    const { roomNumber, type, pricePerNight, capacity, status } = req.body;

    if (!roomNumber || !type) {
      return res.status(400).json({ message: "Số phòng và loại phòng là bắt buộc" });
    }

    const data = readData();
    const accIndex = data.findIndex((a) => a.id === id);
    if (accIndex === -1) {
      return res.status(404).json({ message: "Không tìm thấy cơ sở lưu trú" });
    }

    const acc = data[accIndex];
    const newRoomId = `${id}-r` + Date.now();
    const newRoom = {
      id: newRoomId,
      roomNumber,
      type,
      pricePerNight: parseFloat(pricePerNight) || 0,
      capacity: parseInt(capacity) || 2,
      status: status || "available"
    };

    if (!acc.rooms) acc.rooms = [];
    acc.rooms.push(newRoom);
    
    // Cập nhật lại thống kê phòng
    acc.totalRooms = acc.rooms.length;
    acc.availableRooms = acc.rooms.filter(r => r.status === "available").length;

    writeData(data);

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: "Không thể thêm phòng", error: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { id, roomId } = req.params;
    const updates = req.body;

    const data = readData();
    const accIndex = data.findIndex((a) => a.id === id);
    if (accIndex === -1) {
      return res.status(404).json({ message: "Không tìm thấy cơ sở lưu trú" });
    }

    const acc = data[accIndex];
    if (!acc.rooms) acc.rooms = [];
    
    const roomIndex = acc.rooms.findIndex(r => r.id === roomId);
    if (roomIndex === -1) {
      return res.status(404).json({ message: "Không tìm thấy phòng trong cơ sở lưu trú này" });
    }

    const existingRoom = acc.rooms[roomIndex];
    const updatedRoom = {
      ...existingRoom,
      ...updates,
      id: existingRoom.id // Bảo vệ ID
    };

    acc.rooms[roomIndex] = updatedRoom;

    // Cập nhật lại thống kê phòng
    acc.totalRooms = acc.rooms.length;
    acc.availableRooms = acc.rooms.filter(r => r.status === "available").length;

    writeData(data);

    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: "Không thể cập nhật phòng", error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const { id, roomId } = req.params;

    const data = readData();
    const accIndex = data.findIndex((a) => a.id === id);
    if (accIndex === -1) {
      return res.status(404).json({ message: "Không tìm thấy cơ sở lưu trú" });
    }

    const acc = data[accIndex];
    if (!acc.rooms) acc.rooms = [];

    const exists = acc.rooms.some(r => r.id === roomId);
    if (!exists) {
      return res.status(404).json({ message: "Không tìm thấy phòng cần xóa" });
    }

    acc.rooms = acc.rooms.filter(r => r.id !== roomId);

    // Cập nhật lại thống kê phòng
    acc.totalRooms = acc.rooms.length;
    acc.availableRooms = acc.rooms.filter(r => r.status === "available").length;

    writeData(data);

    res.json({ success: true, message: "Đã xóa phòng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Không thể xóa phòng", error: error.message });
  }
};
