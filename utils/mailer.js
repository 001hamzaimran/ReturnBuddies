import sgMail from "@sendgrid/mail";

// Load your SendGrid API key
sgMail.setApiKey(process.env.Return_Buddies_SendGrid_API_Key);
export default sgMail;
