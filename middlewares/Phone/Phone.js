import Telnyx from "telnyx";
import { config } from "dotenv";

config();

const from = process.env["TELNYX_PHONE_NUMBER"];
const apiKey = process.env["TELNYX_AUTH_TOKEN"];

const telnyx = new Telnyx({ apiKey });

export const sendSms = async (to, text) => {
  try {
    const response = await telnyx.messages.send({ to, from, text });

    console.log("Message sent:", response.data);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};
