import {
  LabelIssueEmail,
  ExtraChargeEmail,
} from "../middlewares/Email/Email.js";

import moment from "moment";
import Stripe from "stripe";
import mongoose from "mongoose";
import UserModel from "../models/User.js";
import pickupModel from "../models/pickup.model.js";
import { sendNotification } from "../utils/sendNotification.js";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPickup = async (req, res) => {
  try {
    const {
      pickupAddress,
      pickupType,
      pickupDate,
      pickupTime,
      bundleId,
      note,
      paymentMethodId,
      customerId,
      phone,
      total,
      isOversize,
    } = req.body;

    // --- Extract user ID ---
    const userId = req.user?._id || req.headers["x-user-id"];
    const PickupName = "RB-" + Math.floor(100 + Math.random() * 900);

    // --- Basic Validation ---
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(200).json({
        status: 400,
        success: false,
        message: "Invalid or missing user ID",
      });
    }

    const user = await UserModel.findById(userId);


    if (!Array.isArray(bundleId) || bundleId.length === 0) {
      return res.status(200).json({
        status: 400,
        success: false,
        message: "bundleId must be a non-empty array",
      });
    }

    if (
      !pickupType ||
      !pickupDate ||
      !pickupTime ||
      !pickupAddress ||
      !phone ||
      total === undefined
    ) {
      return res.status(200).json({
        status: 400,
        success: false,
        message: `${pickupType}, ${pickupDate}, ${pickupTime}, ${pickupAddress}, ${phone}, ${total} are missing`,
      });
    }

    // --- Validate payment data ---
    if (!customerId || !paymentMethodId) {
      return res.status(200).json({
        status: 400,
        success: false,
        message: "Stripe customer ID and payment method ID are required",
      });
    }

    if (!user.stripeCustomerId || !user.paymentMethodId) {
      user.stripeCustomerId = customerId;
      user.paymentMethodId = paymentMethodId;
      await user.save();
    }
    // --- Create and confirm payment intent with Stripe ---
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      payment_method_types: ["card"],
      customer: user.stripeCustomerId,
      payment_method: paymentMethodId,
      confirm: true,
      description: `Pickup Payment for ${PickupName}`,
      return_url: "retrunbuddies://payment-return",
      metadata: {
        pickupId: String(PickupName),
        userId: String(userId),
        pickupType: String(pickupType),
        pickupDate: new Date(pickupDate).toISOString(),
        pickupTime: String(pickupTime),
      },
    });

    if (paymentIntent.status !== "succeeded") {
      return res.status(200).json({
        status: 400,
        success: false,
        message: "Payment failed",
        paymentIntent,
      });
    }

    // --- Create Pickup record in DB ---
    const pickup = await pickupModel.create({
      note,
      phone,
      userId,
      bundleId,
      PickupName,
      pickupType,
      pickupTime,
      pickupAddress,
      totalPrice: total,
      isOversize: !!isOversize,
      pickupDate: new Date(pickupDate),
      paymentIntentId: paymentIntent.id,
      statusHistory: [{ status: "Pickup Requested", updatedAt: new Date() }],
      Payment: {
        amount: total,
        paymentMethod: "stripe",
        paymentStatus: "completed",
        transactionId: paymentIntent.id,
        paidAt: new Date(),
      },
    });

    // --- Send notification to user ---
    const playerIds =
      user?.devices?.map((d) => d.playerId).filter(Boolean) || [];

    if (playerIds.length > 0) {
      await sendNotification(
        playerIds,
        "📦 Your return is confirmed!",
        `Pickup #${pickup.PickupName}
Pickup Date: ${moment(pickup.pickupDate).format("dddd, MMM D")}
Pickup Window: ${pickup.pickupTime}`
      );
    }

    return res.status(200).json({
      status: 200,
      data: pickup,
      success: true,
      message: "Pickup created successfully",
    });
  } catch (error) {
    console.error("❌ Error creating pickup:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Server error while creating pickup",
    });
  }
};

export const getAllPickups = async (req, res) => {
  try {
    const userId = req.params.userid || req.headers["userid"];

    if (!userId) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: "User ID is required in params or headers",
      });
    }

    const pickups = await pickupModel
      .find({ userId })
      .populate("bundleId")
      .populate("userId")
      .populate("payment")
      .populate("pickupAddress");

    res.status(200).json({
      success: true,
      message: "Pickups fetched successfully",
      data: pickups,
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error fetching pickups:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching pickups",
    });
  }
};

export const PickupbyStatus = async (req, res) => {
  try {
    const userId = req.params.userid || req.headers["userid"];

    if (!userId) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: "User ID is required in params or headers",
      });
    }
    // pickups whose status are not "cancelled","completed","delivered"
    const recentPickups = await pickupModel
      .find({
        userId,
        status: { $nin: ["Pickup Cancelled", "Completed", "Delivered"] },
      })
      .populate({
        path: "bundleId",
        populate: {
          path: "products", // nested field inside bundle
          model: "ProductItem", // model name to populate
        },
      })
      .populate("userId");

    // pickups whose status are  "Pickup cancelled","completed","delivered"
    const pastPickups = await pickupModel
      .find({
        userId,
        status: { $in: ["Pickup Cancelled", "Completed", "Delivered"] },
      })
      .populate({
        path: "bundleId",
        populate: {
          path: "products", // nested field inside bundle
          model: "ProductItem", // model name to populate
        },
      })
      .populate("userId");

    return res.status(200).json({
      success: true,
      message: "Pickups fetched successfully",
      data: { active: recentPickups, past: pastPickups },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error fetching pickups:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching pickups",
    });
  }
};

export const pickupById = async (req, res) => {
  try {
    const userId = req.params.userid || req.headers["userid"];

    if (!userId) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: "User ID is required in params or headers",
      });
    }

    const { id } = req.params;
    const pickup = await pickupModel
      .findById(id)
      .populate("bundleId")
      .populate("userId")
      .populate("pickupAddress");

    return res.status(200).json({
      success: true,
      message: "Pickup fetched successfully",
      data: pickup,
      trackingNumber: pickup?.TrackingNumber || "",
      Carrier: pickup?.Carrier || "",
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error fetching pickup by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching pickup by ID",
    });
  }
};

export const pickupcancelled = async (req, res) => {
  try {
    const { id } = req.params;
    const pickup = await pickupModel.findById(id);

    if (!pickup) {
      return res.status(200).json({
        success: false,
        status: 404,
        message: "Pickup not found",
      });
    }

    if (pickup.status === "Pickup Cancelled") {
      return res.status(200).json({
        success: false,
        status: 400,
        message: "Pickup is already cancelled",
      });
    }

    pickup.status = "Pickup Cancelled";
    await pickup.save();

    return res.status(200).json({
      success: true,
      message: "Pickup cancelled successfully",
      data: pickup,
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error canceling pickup:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while canceling pickup",
    });
  }
};

export const getAllPickupsAdmin = async (req, res) => {
  try {
    const userId = req.params.userid || req.headers["userid"];

    if (!userId) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: "User ID is required in params or headers",
      });
    }

    const pickups = await pickupModel
      .find()
      .populate("userId")
      .populate("pickupAddress")
      .populate({
        path: "bundleId", // populate bundles
        populate: {
          path: "products", // inside each bundle, populate products
          model: "ProductItem", // must match your Product model name
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Pickups fetched successfully",
      data: pickups,
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error fetching pickups:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching pickups",
    });
  }
};

export const getAllCompletedPickupsCount = async (_, res) => {
  try {
    const completedPickups = await pickupModel.countDocuments({
      status: "completed",
    });
    const notCompletedPickups = await pickupModel.countDocuments({
      status: { $ne: "completed", $ne: "Pickup cancelled" },
    });
    return res.status(200).json({
      success: true,
      message: "Completed pickups count fetched successfully",
      data: { completedPickups, notCompletedPickups },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error fetching completed pickups count:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching completed pickups count",
    });
  }
};

export const updatePickupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const Statuses = [
      "Pickup Requested",
      "Picked Up",
      "Inspected",
      "Completed",
      "Pickup Cancelled",
      "In Transit",
      "Delivered",
    ];

    if (!status || !Statuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing status" });
    }

    const pickup = await pickupModel.findById(id);
    if (!pickup) {
      return res
        .status(404)
        .json({ success: false, message: "Pickup not found" });
    }

    if (pickup.status === "Pickup Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot update status of a cancelled pickup",
      });
    }

    // update current status
    pickup.status = status;

    // push into history
    pickup.statusHistory.push({
      status,
      updatedAt: new Date(),
    });

    await pickup.save();

    const user = await pickupModel.findById(id).populate("userId");

    const playerIds =
      user.userId?.devices?.map((d) => d.playerId).filter(Boolean) || [];

    // Item Picked Up - Update
    if (status === "Picked Up") {
      await sendNotification(
        playerIds,
        "✅ Pickup complete",
        `Pickup #${pickup.PickupName} has been picked up.
We’ll let you know once it’s arrived at our warehouse.`
      );
    }
    // Drop-off Complete - (In-Transit)
    if (status === "In Transit") {
      await sendNotification(
        playerIds,
        "Good news!",
        `Your return #${pickup.PickupName} has been dropped off at the carrier and is on its way.`
      );
    }

    // Arrived at Warehouse Update   (Inspected)
    if (status === "Inspected") {
      await sendNotification(
        playerIds,
        "Arrived at Warehouse",
        `Your return #${pickup.PickupName} has arrived at our warehouse. It will be inspected and packed before being sent out to the carrier.`
      );
    }

    return res.status(200).json({
      success: true,
      message: "Pickup status updated successfully",
      data: pickup,
    });
  } catch (error) {
    console.error("❌ Error updating pickup status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating pickup status",
    });
  }
};

export const addCarrierAndTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const { Carrier, TrackingNumber } = req.body;

    if (!Carrier || !TrackingNumber) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: "Carrier and TrackingNumber are required",
      });
    }

    const pickup = await pickupModel.findById(id);

    if (!pickup) {
      return res.status(200).json({
        success: false,
        status: 404,
        message: "Pickup not found",
      });
    }

    if (pickup.status === "Pickup Cancelled") {
      return res.status(200).json({
        success: false,
        status: 400,
        message: "Cannot add Carrier and TrackingNumber to a cancelled pickup",
      });
    }

    if (pickup.status === "Pickup Requested") {
      return res.status(200).json({
        success: false,
        status: 400,
        message:
          "First update status to 'Picked Up' before adding Carrier and TrackingNumber",
      });
    }

    pickup.Carrier = Carrier;
    pickup.TrackingNumber = TrackingNumber;

    await pickup.save();

    return res.status(200).json({
      success: true,
      message: "Carrier and TrackingNumber added successfully",
      data: pickup,
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error adding Carrier and TrackingNumber:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding Carrier and TrackingNumber",
    });
  }
};

export const addExtraCharges = async (req, res) => {
  try {
    const { id } = req.params;
    const { extraCharges, chargeDetail } = req.body;

    if (!extraCharges) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "extraCharges is required",
      });
    }

    const pickup = await pickupModel.findById(id).populate("userId");

    if (!pickup) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Pickup not found",
      });
    }

    if (pickup.status === "Pickup Cancelled") {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Cannot add extra charges to a cancelled pickup",
      });
    }
    if (pickup.status !== "Inspected") {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "First status must be 'Inspected' before adding extra charges",
      });
    }

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(extraCharges * 100),
      currency: "usd",
      payment_method_types: ["card"],
      customer: pickup.userId.stripeCustomerId,
      payment_method: pickup.userId.paymentMethodId,
      confirm: true,
      description: `Extra Charges for ${pickup.PickupName}`,
      return_url: "retrunbuddies://payment-return",
      metadata: {
        pickupId: String(pickup.PickupName),
        userId: String(id),
        pickupType: String(pickup.pickupType),
        pickupDate: new Date(pickup.pickupDate).toISOString(),
        pickupTime: String(pickup.pickupTime),
      },
    });

    pickup.extraCharge = extraCharges;
    pickup.chargeDetail = chargeDetail || "";
    pickup.totalPrice += parseInt(extraCharges);

    pickup.statusHistory.push({
      type: "extraCharge",
      extraCharge: extraCharges,
      chargeDetail: chargeDetail || "",
      updatedAt: new Date(),
    });

    if (paymentIntent.status !== "succeeded") {
      return res
        .status(200)
        .json({ success: false, message: "Payment failed", paymentIntent });
    }

    await pickup.save();

    await ExtraChargeEmail(pickup?.userId?.email, paymentIntent, extraCharges);

    return res.status(200).json({
      success: true,
      message: "extraCharges added successfully",
      data: pickup,
      paymentIntent,
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error adding extraCharges:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding extraCharges",
    });
  }
};

export const addLabelIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { labelIssue } = req.body;

    if (!labelIssue) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "extraCharges is required",
      });
    }

    const pickup = await pickupModel.findById(id).populate("userId");

    if (!pickup) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Pickup not found",
      });
    }

    if (pickup.status === "Pickup Cancelled") {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Cannot add issue to a cancelled pickup",
      });
    }

    if (pickup.status !== "Inspected") {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "First status must be 'Inspected' before adding Issue",
      });
    }

    pickup.labelIssue = labelIssue;

    pickup.statusHistory.push({
      type: "Issue",
      labelIssue,
      updatedAt: new Date(),
    });

    await pickup.save();

    await LabelIssueEmail(pickup?.userId?.email, labelIssue, pickup.PickupName);

    const playerIds =
      pickup?.userId?.devices?.map((d) => d.playerId).filter(Boolean) || [];

    // Label problem - Label issue notification
    await sendNotification(
      playerIds,
      `⚠️ Label issue detected for #${pickup.PickupName}`,
      "There’s a problem with your return label. Please contact us so we can help resolve it."
    );
    return res.status(200).json({
      success: true,
      message: "extraCharges added successfully",
      data: pickup,
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error adding extraCharges:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding extraCharges",
    });
  }
};

// export const getPickupByDateandTime = async (req, res) => {
//   try {
//     const { date, timeSlot } = req.query;
//     if (!date || !timeSlot) {
//       return res.status(400).json({ error: "Date and timeSlot are required." });
//     }
// const pickup = await pickupModel.findOne({
//   pickupDate: date,
//   pickupTime: timeSlot,
// });
//     return res.json({ pickup });
//   } catch (err) {
//     console.error("Error fetching pickups:", err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

export const getPickupByDateandTime = async (req, res) => {
  try {
    const { date, timeSlot } = req.query;

    if (!date || !timeSlot) {
      return res.status(400).json({ error: "Date and timeSlot are required." });
    }

    // Create start and end of the day for the given date
    const startOfDay = moment(date, "YYYY-MM-DD").startOf("day").toDate();
    const endOfDay = moment(date, "YYYY-MM-DD").endOf("day").toDate();

    // Get all pickups for that day and timeSlot
    const pickups = await pickupModel.find({
      pickupDate: { $gte: startOfDay, $lte: endOfDay },
      pickupTime: timeSlot,
    });

    return res.json({ pickups });
  } catch (err) {
    console.error("Error fetching pickups:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePickupDateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { pickupDate } = req.body;
    if (!pickupDate) {
      return res.status(400).json({ error: "pickupDate is required." });
    }
    const pickup = await pickupModel.findById(id);
    if (!pickup) {
      return res.status(404).json({ error: "Pickup not found." });
    }
    pickup.pickupDate = pickupDate;
    await pickup.save();
    return res.json({
      status: 200,
      pickup,
      message: "Pickup date updated successfully.",
      success: true,
    });
  } catch (err) {
    console.error("Error fetching pickups:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const markPickupAsRead = async (req, res) => {
  try {
    const pickupId = req.params.id;
    const pickup = await pickupModel.findByIdAndUpdate(
      pickupId,
      { isRead: true },
      { new: true }
    );
    if (!pickup) return res.status(404).json({ message: "Pickup not found" });
    return res.json({ message: "Marked as read", pickup });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
