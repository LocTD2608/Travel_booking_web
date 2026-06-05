require('dotenv').config();
try { require("./src/workers/bookingWorker"); } catch (e) { console.warn("⚠️  BookingWorker skipped (Redis not available)"); }
try { require("./src/cron/cancelBooking"); } catch (e) { console.warn("⚠️  CancelBooking cron skipped (Redis not available)"); }

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Backend running on port ${PORT}`);
});
