import addressSchema from "../models/Address.js";
import UserModel from "../models/User.js";

const ZipCodes = [
  11252, 11209, 11220, 10280, 10080, 10281, 10282, 10006, 10004, 11228,
  10008, 10271, 10041, 10277, 10013, 10045, 10279, 10005, 10007, 10043,
  10270, 10108, 10117, 10124, 10125, 10126, 10129, 10130, 10131, 10132,
  10133, 10138, 10156, 10157, 10159, 10160, 10163, 10164, 10185, 10203,
  10211, 10212, 10213, 10256, 10258, 10259, 10260, 10261, 10265, 10268,
  10269, 10272, 10273, 10274, 10275, 10285, 10286, 10014, 10011, 10278,
  11231, 10038, 11232, 11214, 10090, 10113, 10012, 10199, 11219, 10018,
  10001, 10249, 10116, 11202, 10121, 10242, 10119, 10069, 10019, 10122,
  11242, 10060, 11241, 11201, 10118, 10110, 10276, 10123, 11245, 10036,
  10120, 10003, 11204, 10002, 11224, 10101, 10010, 10175, 10107, 10106,
  11217, 11215, 10009, 10023, 10112, 10173, 10020, 10165, 11218, 10176,
  10016, 10105, 10103, 10111, 10104, 10024, 11243, 10178, 10168, 10166,
  10179, 10169, 10170, 10177, 10102, 10109, 10114, 10158, 10174, 10167,
  10081, 10087, 10172, 10055, 11223, 10171, 10017, 10151, 10153, 10154,
  10152, 11251, 10150, 10155, 10022, 11230, 11249, 11205, 11238, 10115,
  10025, 10065, 11226, 10021, 11109, 10075, 10027, 10026, 10028, 11225,
  10044, 10162, 10031, 11120, 10032, 10128, 11216, 11211, 11210, 11222,
  10029, 11206, 10030, 11229, 11235, 10033, 10039, 10037, 11213, 11101,
  11203, 11106, 10035, 10040, 11221, 11102, 10034, 10452, 11233, 10451,
  11247, 11104, 11237, 10454, 11212, 10453, 11103, 11234, 10463, 11105,
  11378, 10456, 11377, 10455, 10471, 10468, 10702, 11236, 10457, 11207,
  10705, 10459, 11370, 10458, 10474, 11372, 11379, 11385, 10460, 11373,
  11239, 11208, 10467, 11369, 11371, 10470, 10472, 10704, 11374, 10473,
  11256, 11421, 10462, 11368, 11416, 11417, 10466, 11414, 10469, 10461,
  11356, 11375, 10551, 10550, 11418, 11415, 11367, 11354, 10475, 11351,
  11424, 10552, 11380, 11352, 11419, 11355, 11693, 10553, 11420, 11386,
  10465, 11357, 11435, 11405, 11425, 11499, 10803, 11431, 11436, 11451,
  11439, 11358, 11365, 11432, 11366, 11433, 10464, 10801, 10802, 10805,
  11360, 11359, 11434, 11361, 11423, 11437, 11412, 11364
];


export const addAddress = async (req, res) => {
  try {
    const { street, city, state, postalCode, suite, isDefault } = req.body;
    const userId = req.params.userid || req.headers['userid'];

    if (!ZipCodes.includes(Number(postalCode))) {
      return res.status(200).json({ status: 400, message: "OOPS, looks like we’re not in your area", success: false });
    }

    if (!street || !city || !state || !postalCode) {
      return res.status(200).json({ status: 400, message: "All fields are required", success: false });
    }

    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return res.status(200).json({ status: 404, message: "User not found", success: false });
    }

    if (isDefault === 1 || isDefault === true) {
      // Unset previous defaults first
      await addressSchema.updateMany(
        { userId },
        { $set: { isDefault: false } }
      );
    }

    const address = await addressSchema.create({
      userId,
      street,
      city,
      state,
      postalCode,
      suite,
      isDefault: (isDefault === 1 || isDefault === true) // force convert to boolean
    });

    if (isDefault === 1 || isDefault === true) {
      user.pickupAddress = address._id;
      await user.save();
    }

    return res.status(200).json({ Address: address, isDefault, status: 200, success: true, user });
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

    if (!ZipCodes.includes(Number(postalCode))) {
      return res.status(200).json({ status: 400, message: "OOPS, looks like we’re not in your area", success: false });
    }

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
export const deleteAddress = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(200).json({ status: 400, message: "Address Id is required" });
    }

    const deleteAddress = await addressSchema.findByIdAndDelete(userid);

    if (!deleteAddress) {
      return res.status(200).json({ status: 404, message: "Address not found" });
    }

    const user = await UserModel.findById(deleteAddress.userId);

    if (user && user.pickupAddress?.toString() === userid) {
      user.pickupAddress = null;
      await user.save();
    }

    return res.status(200).json({
      status: 200,
      message: "Address deleted successfully",
      deleteAddress
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
