require('dotenv').config();
const db = require('./src/configs/database.js');

async function test() {
  const [hotels] = await db.query('SELECT * FROM khach_san');
  console.log("Hotels:", hotels.length);
  console.log("Hotel Addresses:", hotels.map(h => h.DiaChi));
  
  const [sanbay] = await db.query('SELECT * FROM SAN_BAY');
  console.log("Airports:", sanbay);
  
  process.exit();
}
test();
