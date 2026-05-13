const transporter = require("../configs/mailer");

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Travel Booking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (err) {
    console.log("Email error:", err);
  }
};

module.exports = sendMail;