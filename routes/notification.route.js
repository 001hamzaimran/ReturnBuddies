import express from "express";
import { sendNotification } from "../utils/sendNotification.js";

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

export default router;
