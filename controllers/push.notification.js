import moment from "moment";
import UserModel from "../models/User.js";
import { sendNotification } from "../utils/sendNotification.js";
import pickupModel from "../models/pickup.model.js";

export const testNotification = async (req, res) => {
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
};

  export const oneDayBeforePickup = async () => {
    try {
      const pickup = await pickupModel
        .findOne({
          pickupDate: {
            $gte: new Date(),
            $lt: new Date(new Date().setDate(new Date().getDate() + 1)),
          },
        })
        .populate("userId");

      const playerIds =
        pickup?.userId?.devices?.map((d) => d.playerId).filter(Boolean) || [];
      if (!pickup) {
        return;
      }
      await sendNotification(
        playerIds,
        "⏰ Reminder",
        `Your Pickup #${pickup.PickupName} is scheduled for ${moment(pickup.pickupDate).format("dddd, MMMM, D")}.
Make sure your item(s) are ready. You’ll also receive a text message from the driver when they are on the way.
`
      );
    } catch (err) {
      console.error("Error sending one day before pickup notification:", err);
    }
  };

export const morningOfPickup = async () => {
  try {
    const pickup = await pickupModel
      .findOne({
        pickupDate: {
          $gte: new Date(),
          $lt: new Date(new Date().setDate(new Date().getDate() )),
        },
      })
      .populate("userId");

      const playerIds =
      pickup?.userId?.devices?.map((d) => d.playerId).filter(Boolean) || [];
    if (!pickup) {
      return;
    }
    await sendNotification(
      playerIds,
      "It’s Pickup day!",
      `Your Pickup #${pickup.PickupName} is scheduled for ${moment(pickup.pickupDate).format("dddd, MMMM, D")}.
Make sure your item(s) are ready. You’ll also receive a text message from the driver when they are on the way.
`
    );
  } catch (err) {
    console.error("Error sending morning of pickup notification:", err);
  }
};