import express from "express";
import { sendNotification } from "../utils/sendNotification.js";
import UserModel from "../models/User.js";
const router = express.Router();

router.post("/send", async (req, res) => {
  const { playerIds, title, message } = req.body;

  try {
    const result = await sendNotification(playerIds, title, message);
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }


});

router.post("/test", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // Find user in database
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Extract playerIds from user's devices
    const playerIds = user.devices?.map((d) => d.playerId).filter(Boolean);

    if (!playerIds || playerIds.length === 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "No device tokens found for this user",
      });
    }

    // Send test notification
    const result = await sendNotification(
      playerIds,
      "🚀 Test Notification",
      "This is a test push notification from your Node.js backend!"
    );

    res.status(200).json({
      status: 200,
      success: true,
      message: `Notification sent to ${playerIds.length} device(s)`,
      result,
    });
  } catch (err) {
    console.error("Error sending test notification:", err);
    res.status(500).json({ status: 500, success: false, error: err.message });
  }
});

export default router;
