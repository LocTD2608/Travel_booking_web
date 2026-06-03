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

const sendBookingSuccessEmail = async (user, booking) => {
  const html = `
  <div style="
      font-family:Segoe UI,Arial,sans-serif;
      background:#f5f7fa;
      padding:30px;
  ">

    <div style="
      max-width:700px;
      margin:auto;
      background:white;
      border-radius:16px;
      overflow:hidden;
      box-shadow:0 8px 30px rgba(0,0,0,.1);
    ">

      <div style="
        background:#0194f3;
        padding:30px;
        text-align:center;
        color:white;
      ">
        <div style="text-align:center;">
          <div style="
            text-align:center;
            font-size:30px;
            font-weight:800;
            color:#000;
            letter-spacing:2px;
            font-family:Arial,sans-serif;
            margin-bottom:10px;
          ">
            Traveloka
          </div>
        </div>

        <p style="margin-top:10px;">
          Xác nhận thanh toán thành công
        </p>
      </div>

      <div style="padding:35px;">

        <h2 style="margin-top:0;">
          Xin chào ${user.Ho || ""} ${user.Ten || ""}
        </h2>

        <p>
          Booking của bạn đã được thanh toán thành công.
        </p>

        <div style="
          background:#f8fafc;
          border:1px solid #e5e7eb;
          border-radius:12px;
          padding:20px;
          margin:25px 0;
        ">

          <h3 style="margin-top:0;">
            Thông tin giao dịch
          </h3>

          <p>
            <strong>Mã booking:</strong>
            ${booking.MaBooking}
          </p>

          <p>
            <strong>Ngày thanh toán:</strong>
            ${new Date().toLocaleString("vi-VN")}
          </p>

          <p>
            <strong>Tổng tiền:</strong>
            ${Number(booking.TongTien).toLocaleString()} VNĐ
          </p>

          <p>
            <strong>Trạng thái:</strong>
            ${booking.TrangThaiBooking}
          </p>

        </div>
      </div>

      <div style="
        margin-top:30px;
        padding:20px;
        background:#f8fafc;
        border-radius:12px;
        text-align:center;
      ">
        <h3 style="
          color:#0194f3;
          margin-top:0;
        ">
          Cảm ơn bạn!
        </h3>

        <p style="
          color:#334155;
          margin-bottom:10px;
          line-height:1.6;
        ">
          Cảm ơn bạn đã sử dụng dịch vụ Travel Booking.
        </p>

        <p style="
          color:#334155;
          margin:0;
          line-height:1.6;
        ">
          Chúc bạn có chuyến đi vui vẻ và nhiều trải nghiệm đáng nhớ.
        </p>
      </div>

      <div style="
        background:#f1f5f9;
        text-align:center;
        padding:20px;
        color:#64748b;
      ">
        © 2026 Travel Booking
      </div>

    </div>

  </div>
  `;

  return sendMail({
    to: user.Email,
    subject: "Xác nhận thanh toán thành công",
    html,
  });
};

module.exports = {
  sendMail,
  sendBookingSuccessEmail,
};