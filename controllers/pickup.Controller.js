import pickupModel from '../models/pickup.model.js';
import mongoose from 'mongoose';

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

        const pickup = new pickupModel({
            userId,
            pickupAddress,
            pickupType,
            pickupDate: new Date(pickupDate),
            pickupTime,
            bundleId,
            note,
            Payment,
            phone,
            totalPrice: total,
            isOversize: !!isOversize // cast to Boolean
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
        // pickups whose status are not "canceled","completed","delivered"
        const recentPickups = await pickupModel.find({ userId, status: { $nin: ["canceled", "completed", "delivered"] } }).populate({
            path: 'bundleId',
            populate: {
                path: 'products', // nested field inside bundle
                model: 'ProductItem'  // model name to populate
            }
        }).populate('userId');

        // pickups whose status are  "canceled","completed","delivered"
        const pastPickups = await pickupModel.find({ userId, status: { $in: ["canceled", "completed", "delivered"] } }).populate({
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
        const pickup = await pickupModel.findById(id).populate('bundleId').populate('userId');
        return res.status(200).json({
            success: true,
            message: "Pickup fetched successfully",
            data: pickup,
            trackingNumber: "123456789",
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