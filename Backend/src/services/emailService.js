const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

exports.sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Mã OTP khôi phục mật khẩu - Traveloka",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #0194f3; text-align: center;">Xác thực tài khoản</h2>
        <p>Chào bạn,</p>
        <p>Bạn đang thực hiện yêu cầu khôi phục mật khẩu. Mã OTP của bạn là:</p>
        <div style="background-color: #f0f9ff; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0194f3; border-radius: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>Mã này sẽ hết hạn sau **10 phút**. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
        <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888888; text-align: center;">Đây là email tự động, vui lòng không phản hồi.</p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
};
