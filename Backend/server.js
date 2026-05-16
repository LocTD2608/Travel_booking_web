require('dotenv').config();
require("./src/workers/bookingWorker");
require("./src/cron/cancelBooking");

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Backend running on port ${PORT}`);
});
