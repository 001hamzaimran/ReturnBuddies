import pickupModel from "../models/pickup.model.js";
import UserModel from "../models/User.js";

// get all users with roles user
const getUsers = async (req, res) => {
  try {
    // fetch all users
    const users = await UserModel.find({ role: "user" })
      .populate("role")
      .populate("pickupAddress");

    // get all pickups for those users
    const userIds = users.map((user) => user._id);
    const pickups = await pickupModel.find({ userId: { $in: userIds } });

    // build a map of userId -> pickup count
    const pickupCountMap = {};
    pickups.forEach((p) => {
      const uid = p.userId.toString();
      pickupCountMap[uid] = (pickupCountMap[uid] || 0) + 1;
    });

    // attach pickupCount to each user
    const usersWithPickupCount = users.map((user) => {
      return {
        ...user.toObject(),
        pickupCount: pickupCountMap[user._id.toString()] || 0,
      };
    });

    return res.status(200).json({ data: usersWithPickupCount, success: true });
  } catch (error) {
    console.error("❌ getUsers error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};

export { getUsers };
