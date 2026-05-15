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

exports.sendBookingSuccess = async (booking) => {
    // Tạo link Barcode động dựa trên mã Booking (dùng API miễn phí)
    const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${booking.MaBooking}&code=Code128&dpi=96`;
    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: booking.Email || "user@example.com",
        subject: `🎫 E-Ticket: Xác nhận đặt chỗ thành công #${booking.MaBooking}`,
        html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #f4f7f6; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                
                <!-- Header -->
                <div style="background-color: #1BA0E2; padding: 30px 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">TRAVEL BOOKING</h1>
                    <p style="margin: 5px 0 0; opacity: 0.9;">Vé Điện Tử / E-Ticket</p>
                </div>

                <!-- Body -->
                <div style="padding: 30px;">
                    <h2 style="color: #333; font-size: 20px; margin-top: 0;">Xin chào,</h2>
                    <p style="color: #555; line-height: 1.6;">Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi. Dưới đây là vé điện tử chính thức của bạn. Bạn có thể sử dụng vé này để check-in hoặc xuất trình khi sử dụng dịch vụ thay cho vé giấy.</p>

                    <!-- Ticket Card -->
                    <div style="border: 2px dashed #1BA0E2; border-radius: 8px; padding: 20px; margin: 30px 0; background-color: #fafdfc;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td width="50%" style="padding-bottom: 15px;">
                                    <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase;">Mã Đặt Chỗ (PNR)</p>
                                    <p style="margin: 5px 0 0; color: #1BA0E2; font-size: 28px; font-weight: bold;">${booking.MaBooking}</p>
                                </td>
                                <td width="50%" align="right" style="padding-bottom: 15px;">
                                    <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase;">Ngày Đặt</p>
                                    <p style="margin: 5px 0 0; color: #333; font-size: 16px; font-weight: bold;">${new Date().toLocaleDateString('vi-VN')}</p>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="border-top: 1px solid #eee; padding-top: 15px;">
                                    <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase;">Tổng Thanh Toán</p>
                                    <p style="margin: 5px 0 0; color: #e74c3c; font-size: 20px; font-weight: bold;">${formatCurrency(booking.TongTien)}</p>
                                </td>
                            </tr>
                        </table>

                        <!-- Barcode -->
                        <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 2px dashed #eee;">
                            <img src="${barcodeUrl}" alt="Barcode" style="max-width: 100%; height: 70px;" />
                            <p style="margin: 5px 0 0; color: #888; font-size: 12px; letter-spacing: 2px;">Vui lòng xuất trình mã vạch này khi yêu cầu</p>
                        </div>
                    </div>

                    <!-- Important Notes -->
                    <div style="background-color: #fff8e1; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px;">
                        <h4 style="margin: 0 0 10px; color: #b08a00;">Lưu ý quan trọng:</h4>
                        <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.5;">
                            <li>Vui lòng lưu lại email này hoặc chụp màn hình mã vạch để sử dụng.</li>
                            <li>Nếu có thay đổi lịch trình, vui lòng liên hệ CSKH trước 24h.</li>
                        </ul>
                    </div>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost:5173/profile" style="display: inline-block; padding: 12px 30px; background-color: #1BA0E2; color: white; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">Xem Chi Tiết Dịch Vụ</a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #333; padding: 20px; text-align: center; color: #aaa; font-size: 12px;">
                    <p style="margin: 0;">© ${new Date().getFullYear()} Travel Booking. All rights reserved.</p>
                    <p style="margin: 5px 0 0;">Hotline: 1900 1234 | Email: support@travelbooking.com</p>
                </div>
            </div>
        </div>
        `
    };

    return transporter.sendMail(mailOptions);
};