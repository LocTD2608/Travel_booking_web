const nodemailer = require("nodemailer");

async function testMail() {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: `"Test System" <${process.env.EMAIL_USER}>`,
    to: "tranvanhoang28012006@gmail.com",
    subject: "Test gửi mail từ NodeJS",
    text: "NGU",
  });

  console.log("Message sent: " + info.messageId);
}

require("dotenv").config();
testMail().catch(console.error);