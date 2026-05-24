const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendMail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject,
            text,
        });

        console.log("Email sent:", info.response);

        return true;
    } catch (error) {
        console.log("Send mail error:", error);

        return false;
    }
};

module.exports = sendMail;