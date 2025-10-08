import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

export const sendNotification = async (playerIds, title, message, data = {}) => {
  try {
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        data,
        app_id: ONESIGNAL_APP_ID,
        headings: { en: title },
        contents: { en: message },
        include_player_ids: playerIds,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
      }
    );

    console.log("Notification sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending notification:", error.response?.data || error.message);
  }
};
