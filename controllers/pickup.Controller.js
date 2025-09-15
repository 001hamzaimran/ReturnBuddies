import pickupModel from '../models/pickup.model.js';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import CardModel from '../models/Card.Model.js';
import { ExtraChargeEmail, LabelIssueEmail } from '../middlewares/Email/Email.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPickup = async (req, res) => {
    try {
        const {
            pickupAddress,
            pickupType,
            pickupDate,
            pickupTime,
            bundleId,
            note,
            Payment,
            phone,
            total,
            isOversize
        } = req.body;

        // Extract userId from middleware-authenticated headers
        const userId = req.user?._id || req.headers['x-user-id'];
        const PickupName = "RB-" + Math.floor(100 + Math.random() * 900);


        // === Basic Validation ===
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(200).json({ status: 400, success: false, message: "Invalid or missing user ID" });
        }

        if (!Array.isArray(bundleId) || bundleId.length === 0) {
            return res.status(200).json({ status: 400, success: false, message: "bundleId must be a non-empty array" });
        }

        if (!pickupType || !pickupDate || !pickupTime || !pickupAddress || !phone || total === undefined) {
            return res.status(200).json({ status: 400, success: false, message: "Required fields are missing" });
        }

        if (typeof phone !== 'string' || !/^[0-9]{10,15}$/.test(phone)) {
            return res.status(200).json({ status: 400, success: false, message: "Invalid phone number format" });
        }

        const card = await CardModel.findById(Payment);
        if (!card) {
            return res.status(200).json({ status: 400, success: false, message: "Invalid Payment method" });
        }

        // === Process Payment with Stripe ===
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: "usd",
            payment_method_types: ["card"],
            payment_method: "pm_card_visa", // Stripe test card token
            confirm: true,
            description: `Pickup Payment for ${PickupName}`,
            metadata: {
                pickupId: String(PickupName),
                userId: String(userId),
                pickupType: String(pickupType),
                pickupDate: new Date(pickupDate).toISOString(),
                pickupTime: String(pickupTime),
            }
        });


        if (paymentIntent.status !== "succeeded") {
            return res.status(200).json({ success: false, message: "Payment failed", paymentIntent });
        }

        const pickup = new pickupModel({
            userId,
            pickupAddress,
            PickupName,
            pickupType,
            pickupDate: new Date(pickupDate),
            pickupTime,
            bundleId,
            note,
            Payment,
            phone,
            totalPrice: total,
            isOversize: !!isOversize,
            statusHistory: [{ status: "Pickup Requested", updatedAt: new Date() }]
        });

        await pickup.save();

        res.status(200).json({
            success: true,
            status: 200,
            message: "Pickup created successfully",
            data: pickup
        });

    } catch (error) {
        console.error("❌ Error creating pickup:", error);
        res.status(500).json({
            success: false,
            message: "Server error while creating pickup"
        });
    }
};

export const getAllPickups = async (req, res) => {
    try {
        const userId = req.params.userid || req.headers['userid'];

        if (!userId) {
            return res.status(200).json({
                success: false,
                status: 400,
                message: "User ID is required in params or headers"
            });
        }

        const pickups = await pickupModel.find({ userId }).populate('bundleId').populate('userId').populate('Payment');

        res.status(200).json({
            success: true,
            message: "Pickups fetched successfully",
            data: pickups,
            status: 200
        });
    } catch (error) {
        console.error("❌ Error fetching pickups:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching pickups"
        });
    }
};

export const PickupbyStatus = async (req, res) => {
    try {
        const userId = req.params.userid || req.headers['userid'];

        if (!userId) {
            return res.status(200).json({
                success: false,
                status: 400,
                message: "User ID is required in params or headers"
            });
        }
        // pickups whose status are not "cancelled","completed","delivered"
        const recentPickups = await pickupModel.find({ userId, status: { $nin: ["Pickup cancelled", "completed", "delivered"] } }).populate({
            path: 'bundleId',
            populate: {
                path: 'products', // nested field inside bundle
                model: 'ProductItem'  // model name to populate
            }
        }).populate('userId');

        // pickups whose status are  "Pickup cancelled","completed","delivered"
        const pastPickups = await pickupModel.find({ userId, status: { $in: ["Pickup cancelled", "completed", "delivered"] } }).populate({
            path: 'bundleId',
            populate: {
                path: 'products', // nested field inside bundle
                model: 'ProductItem'  // model name to populate
            }
        }).populate('userId');

        return res.status(200).json({
            success: true,
            message: "Pickups fetched successfully",
            data: { active: recentPickups, past: pastPickups },
            status: 200
        });
    } catch (error) {
        console.error("❌ Error fetching pickups:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching pickups"
        });
    }
};

export const pickupById = async (req, res) => {
    try {
        const userId = req.params.userid || req.headers['userid'];

        if (!userId) {
            return res.status(200).json({
                success: false,
                status: 400,
                message: "User ID is required in params or headers"
            });
        }

        const { id } = req.params;
        const pickup = await pickupModel.findById(id).populate('bundleId').populate('userId').populate('pickupAddress');
        return res.status(200).json({
            success: true,
            message: "Pickup fetched successfully",
            data: pickup,
            trackingNumber: pickup?.TrackingNumber || "123456789",
            Carrier: pickup?.Carrier || "UPS",
            status: 200
        });
    } catch (error) {
        console.error("❌ Error fetching pickup by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching pickup by ID"
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
                message: "Pickup not found"
            });
        }

        if (pickup.status === "Pickup Cancelled") {
            return res.status(200).json({
                success: false,
                status: 400,
                message: "Pickup is already cancelled"
            });
        }

        pickup.status = "Pickup Cancelled";
        await pickup.save();

        return res.status(200).json({
            success: true,
            message: "Pickup cancelled successfully",
            data: pickup,
            status: 200
        });
    } catch (error) {
        console.error("❌ Error canceling pickup:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while canceling pickup"
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
                path: "bundleId",          // populate bundles
                populate: {
                    path: "products",        // inside each bundle, populate products
                    model: "ProductItem",        // must match your Product model name
                },
            });

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


export const getAllCompletedPickupsCount = async (req, res) => {
    try {
        const completedPickups = await pickupModel.countDocuments({ status: "completed" });
        const notCompletedPickups = await pickupModel.countDocuments({ status: { $ne: "completed", $ne: "Pickup cancelled" } });
        return res.status(200).json({
            success: true,
            message: "Completed pickups count fetched successfully",
            data: { completedPickups, notCompletedPickups },
            status: 200
        });
    } catch (error) {
        console.error("❌ Error fetching completed pickups count:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching completed pickups count"
        });
    }
};


export const updatePickupStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const Statuses = ['Pickup Requested', 'Picked Up', 'Inspected', 'Completed', 'Pickup Cancelled', 'In Transit', 'Delivered'];

        if (!status || !Statuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid or missing status" });
        }

        const pickup = await pickupModel.findById(id);
        if (!pickup) {
            return res.status(404).json({ success: false, message: "Pickup not found" });
        }

        if (pickup.status === "Pickup Cancelled") {
            return res.status(400).json({ success: false, message: "Cannot update status of a cancelled pickup" });
        }

        // update current status
        pickup.status = status;

        // push into history
        pickup.statusHistory.push({
            status,
            updatedAt: new Date()
        });

        await pickup.save();

        return res.status(200).json({
            success: true,
            message: "Pickup status updated successfully",
            data: pickup
        });
    } catch (error) {
        console.error("❌ Error updating pickup status:", error);
        return res.status(500).json({ success: false, message: "Server error while updating pickup status" });
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
                message: "Carrier and TrackingNumber are required"
            });
        }

        const pickup = await pickupModel.findById(id);

        if (!pickup) {
            return res.status(200).json({
                success: false,
                status: 404,
                message: "Pickup not found"
            });
        }

        if (pickup.status === "Pickup Cancelled") {
            return res.status(200).json({
                success: false,
                status: 400,
                message: "Cannot add Carrier and TrackingNumber to a cancelled pickup"
            });
        }

        if (pickup.status === "Pickup Requested") {
            return res.status(200).json({
                success: false,
                status: 400,
                message: "First update status to 'Picked Up' before adding Carrier and TrackingNumber"
            });
        }

        pickup.Carrier = Carrier;
        pickup.TrackingNumber = TrackingNumber;

        await pickup.save();

        return res.status(200).json({
            success: true,
            message: "Carrier and TrackingNumber added successfully",
            data: pickup,
            status: 200
        });
    } catch (error) {
        console.error("❌ Error adding Carrier and TrackingNumber:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while adding Carrier and TrackingNumber"
        });
    }
}

export const addExtraCharges = async (req, res) => {
    try {
        const { id } = req.params;
        const { extraCharges } = req.body;

        if (!extraCharges) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "extraCharges is required"
            });
        }

        const pickup = await pickupModel.findById(id).populate('userId');

        if (!pickup) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Pickup not found"
            });
        }

        if (pickup.status === "Pickup Cancelled") {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Cannot add extra charges to a cancelled pickup"
            });
        }

        if (pickup.status !== "Inspected") {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "First status must be 'Inspected' before adding extra charges"
            });
        }

        pickup.extraCharge = extraCharges;
        pickup.totalPrice += parseInt(extraCharges);

        pickup.statusHistory.push({
            type: "extraCharge",
            extraCharge: extraCharges,
            updatedAt: new Date(),
        });

        await pickup.save();

        await ExtraChargeEmail(pickup?.userId?.email, extraCharges)

        return res.status(200).json({
            success: true,
            message: "extraCharges added successfully",
            data: pickup,
            status: 200
        });
    } catch (error) {
        console.error("❌ Error adding extraCharges:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while adding extraCharges"
        });
    }
}
export const addLabelIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const { labelIssue } = req.body;

        if (!labelIssue) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "extraCharges is required"
            });
        }

        const pickup = await pickupModel.findById(id).populate('userId');

        if (!pickup) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Pickup not found"
            });
        }

        if (pickup.status === "Pickup Cancelled") {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Cannot add issue to a cancelled pickup"
            });
        }

        if (pickup.status !== "Inspected") {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "First status must be 'Inspected' before adding Issue"
            });
        }

        pickup.labelIssue = labelIssue;

        pickup.statusHistory.push({
            type: "Issue",
            labelIssue,
            updatedAt: new Date(),
        });

        await pickup.save();

        await LabelIssueEmail(pickup?.userId?.email, labelIssue)
        return res.status(200).json({
            success: true,
            message: "extraCharges added successfully",
            data: pickup,
            status: 200
        });
    } catch (error) {
        console.error("❌ Error adding extraCharges:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while adding extraCharges"
        });
    }
}

export const getPickupByDateandTime = async (req, res) => {
    try {
        const { date, timeSlot } = req.query;
        if (!date || !timeSlot) {
            return res.status(400).json({ error: "Date and timeSlot are required." });
        }
        const pickup = await pickupModel.findOne({ pickupDate: date, pickupTime: timeSlot });
        return res.json({ pickup });
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
        return res.json({ status: 200, pickup, message: "Pickup date updated successfully.", success: true });
    } catch (err) {
        console.error("Error fetching pickups:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};