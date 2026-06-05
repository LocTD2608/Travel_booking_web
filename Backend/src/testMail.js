require("dotenv").config();

const nodemailer = require("nodemailer");

async function testMail() {
  try {
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
      text: "Nodemailer hoạt động thành công",
    });

    console.log("Message sent:", info.messageId);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Send mail error:", error);
  }
}

testMail();