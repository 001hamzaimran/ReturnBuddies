import UserModel from "../models/User.js";

// get all users with roles user
const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find({ role: "user" }).populate("role").populate("pickupAddress");
        return res.status(200).json({ data: users, success: true });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error", success: false });
    }
}


export { getUsers }