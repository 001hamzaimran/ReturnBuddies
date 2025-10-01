import nodemailer from "nodemailer";
import sgMail from "../../utils/mailer.js";
import dotenv from "dotenv";

dotenv.config();

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

console.log("process.env.Email_Sender",process.env.Email_Sender)
export const sendMail = async ({ to, subject, text, html }) => {
  try {
    const msg = {
      to,
      from: `"RETURNBUDDIES" <${process.env.Email_Sender}>`,
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email failed:", error);
    if (error.response) {
      console.error(error.response.body); // SendGrid detailed error
    }
  }
};
