import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SendGrid_API_Key);
export default sgMail;
