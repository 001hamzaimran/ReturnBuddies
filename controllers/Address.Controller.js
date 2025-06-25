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
            suite,
            isDefault
        });
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            return res.status(200).json({ status: 404, message: "User not found", success: false });
        }

        if (isDefault === 1 || isDefault === true) {
            await addressSchema.updateMany(
                { userId },
                { $set: { isDefault: false } }
            );
        }
        if (isDefault === 1) {

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

// export const addressUpdate = async (req, res) => {
//     try {
//         const { isDefault, addressId } = req.body;
//         const userId = req.params.userid || req.headers['userid'];

//         if (!userId || !addressId) {
//             return res.status(200).json({ success: false, message: "userId and addressId are required", status: 400 });
//         }

//         const user = await UserModel.findById(userId);
//         if (!user) {
//             return res.status(200).json({ success: false, message: "User not found", status: 404 });
//         }

//         if (isDefault === 1 || isDefault === true) {
//             await addressSchema.updateMany(
//                 { _id: { $ne: addressId } },
//                 { $set: { isDefault: false } }
//             );

//             // Step 2: Set selected address to isDefault: true
//             const updatedAddress = await addressSchema.findByIdAndUpdate(
//                 addressId,
//                 { isDefault: true },
//                 { new: true }
//             );

//             // Step 3: Update user's pickupAddress field
//             user.pickupAddress = addressId;
//             await user.save();

//             return res.status(200).json({
//                 success: true,
//                 status: 200,
//                 message: "Default address updated",
//                 user,
//                 defaultAddress: updatedAddress
//             });
//         } else {
//             return res.status(200).json({ status: 400, success: false, message: "isDefault must be true/1" });
//         }

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };


export const editAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const { street, city, state, postalCode, suite, isDefault } = req.body;
    const userId = req.params.userid || req.headers['userid'];

    // Step 1: Find address
    const address = await addressSchema.findById(addressId);
    if (!address) {
      return res.status(200).json({ status: 404, message: "Address not found", success: false });
    }

    // Step 2: If isDefault = true, reset all other addresses for that user
    if (isDefault === 1 || isDefault === true) {
      await addressSchema.updateMany(
        { userId: address.userId, _id: { $ne: addressId } },
        { $set: { isDefault: false } }
      );
    }

    // Step 3: Update address
    address.street = street;
    address.city = city;
    address.state = state;
    address.postalCode = postalCode;
    address.suite = suite;
    address.isDefault = isDefault === 1 || isDefault === true;
    await address.save();

    return res.status(200).json({
      status: 200,
      message: "Address updated successfully",
      success: true,
      address
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
      success: false
    });
  }
};