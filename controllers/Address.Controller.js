import addressSchema from "../models/Address.js";
import UserModel from "../models/User.js";

export const addAddress = async (req, res) => {
    try {
        const { street, city, state, postalCode, suite, isDefault } = req.body;
        const userId = req.params.userid || req.headers['userid'];
        if (!street || !city || !state || !postalCode || !suite) {
            return res.status(200).json({ status: 400, message: "All fields are required", success: false });
        }

        const address = await addressSchema.create({
            userId,
            street,
            city,
            state,
            postalCode,
            suite
        });

        if (isDefault === 1) {
            const user = await UserModel.findOne({ _id: userId });
            if (!user) {
                return res.status(200).json({ status: 404, message: "User not found", success: false });
            }
            user.pickupAddress = address._id;
            await user.save();
            return res.status(200).json({ Address: address, isDefault, status: 200, success: true, user });

        }
        return res.status(200).json({ Address: address, isDefault, status: 200, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getAllAddresses = async (req, res) => {
    try {
        const userId = req.params.userid || req.headers['userid'];
        const addresses = await addressSchema.find({ userId });
        return res.status(200).json({ addresses, status: 200, success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};