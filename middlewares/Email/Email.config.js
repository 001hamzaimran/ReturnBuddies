import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // must be false for STARTTLS
    auth: {
        user: "developpment.mail@gmail.com",
        pass: "wizw klyf yeuw fdpn", // your App Password
    },
    tls: {
        rejectUnauthorized: false, // helps with some hosting issues
    },
});

export default transporter;
