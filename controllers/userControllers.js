import UserModel from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendVerificationEmail from "../middlewares/Email/Email.js";

import jsonwebtoken from "jsonwebtoken";
import ForgotModal from "../models/ForgotPassword.js";
import { sendSms } from "../middlewares/Phone/Phone.js";

// Register
const Register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Generate OTP token
    const otp = crypto.randomInt(10000, 99999).toString();

    // Send email
    const emailResponse = await sendVerificationEmail(email, otp);
    if (!emailResponse.success) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: emailResponse.message || "Failed to send verification email",
      });
    }

    // Create and save new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      otp,
      FirstLogin: true
    });
    await newUser.save();

    // Sanitize response (omit password and otp)
    const { password: _, otp: __, ...safeUser } = newUser.toObject();

    return res.status(200).json({
      success: true,
      status: 200,
      message: `Email has been sent to ${email}. Please verify your email.`,
      user: safeUser,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
    });
  }
};

// Verify email
const VerifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, status: 400, message: "User not found" });
    }
    if (otp !== user.otp) {
      return res
        .status(200)
        .json({ message: "Invalid OTP", status: 400, success: false });
    }

    user.verified = true;
    user.otp = null;
    user.save();

    return res
      .status(200)
      .json({
        success: true,
        status: 200,
        message: "Email verified successfully",
        user: user,
      });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Internal server error" });
  }
};

// Login
const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email })
      .populate({ path: "pickupAddress", model: "Address" })
      .populate({ path: "payment", model: "Card" });



    if (!user) {
      return res
        .status(200)
        .json({ message: "User Not Found", status: 400 });
    }

    if (user.googleId || user.appleId) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: "Login with google or apple account",
      });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .json({ message: "Invalid Credentials", status: 400 });
    }
    if (!user.verified) {
      const verificationToken = crypto.randomInt(10000, 99999).toString();

      await sendVerificationEmail(email, verificationToken);
      await UserModel.findOneAndUpdate({ email }, { otp: verificationToken });
      return res
        .status(200)
        .json({
          message: `Please verify your email, email send to ${email}`,
          status: 201,
          otp: verificationToken,
        });
    }

    // Track FirstLogin only after verification
    let isFirstLogin = false;
    if (user.FirstLogin === true) {
      isFirstLogin = true;
      user.FirstLogin = false;
      await user.save(); // update in DB
    }


    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res
      .status(200)
      .json({
        message: "Login Successfully",
        status: 200,
        success: true,
        user,
        firstLogin: isFirstLogin,
        token,
      });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 500, success: false });
  }
};

const phoneVerfication = async (req, res) => {
  const { phone } = req.body;
  const userId = req.headers["userid"];

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(200).json({ message: "User not found", status: 404 });
    }
    // Generate OTP token
    const otp = crypto.randomInt(10000, 99999).toString();
    const message = `Your OTP is ${otp}`;

    await sendSms(phone, message);

    // Send OTP to user's phone number
    user.phoneOtp = otp;
    user.phone = phone;
    await user.save();

    return res
      .status(200)
      .json({ message: "Phone number updated successfully", status: 200, user, otp });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 500 });
  }
}

const verifyPhone = async (req, res) => {
  const { otp } = req.body;
  const userId = req.headers["userid"];

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(200).json({ message: "User not found", status: 404 });
    }
    if (otp !== user.phoneOtp) {
      return res.status(200).json({ message: "Invalid OTP", status: 404 });
    }
    user.phoneOtp = null;
    user.phoneVerified = true;
    await user.save();
    return res.status(200).json({ message: "Phone number verified successfully", status: 200, user });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal server error", status: 500 });
  }
}

// Forgot password
const ForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(200).json({
        message: "Email is required",
        status: 400,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "User not found",
        status: 400,
        success: false,
      });
    }

    const otp = crypto.randomInt(10000, 99999).toString();

    // Send OTP to email
    console.log(email)
    await sendVerificationEmail(email, otp);

    // Upsert OTP record in ForgotModal
    const expiresAt = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5 hours from now
    // const expiresAt = new Date(Date.now() + 10 * 1000); // 10 seconds from now

    await ForgotModal.findOneAndUpdate(
      { email },
      { otp, expiresAt, verified: false },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: `OTP has been sent to ${email}`,
      status: 200,
      success: true,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      success: false,
    });
  }
};

const ForgotVerification = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await ForgotModal.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: "User not found",
      });
    }

    // Check if OTP is expired
    if (user.expiresAt < new Date()) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: "OTP has expired",
      });
    }

    // Check if OTP is correct
    if (otp !== user.otp) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: "Invalid OTP",
      });
    }

    // OTP is correct and not expired — mark as verified
    user.verified = true;
    user.otp = null;
    user.expiresAt = null;
    await user.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
    });
  }
};

const ResetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: "User not found",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
    });
  }
}

const UpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user is populated by auth middleware
    const { name, oldPassword, newPassword, phone } = req.body;

    if (newPassword && !oldPassword) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Old password is required to change password",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    // Update name and phone if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Handle password update with old password verification
    if (oldPassword && newPassword) {
      const isMatch = bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Old password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    } else if (oldPassword || newPassword) {
      // If one is missing, require both
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Both old and new passwords are required to change password",
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
      },
    });
  } catch (error) {
    console.error("UpdateProfile error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
    });
  }
};

const DeleteAccount = async (req, res) => {
  try {
    const user = req.headers['userid'];

    if (!user) {
      return res.status(200).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    const deletedUser = await UserModel.findByIdAndDelete(user);
    if (deletedUser) {
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Account deleted successfully",
      });
    } else {
      return res.status(200).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
    })
  }
};


const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user; // From authentication middleware

  try {
    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: 'Both current and new passwords are required'
      });
    }

    // Verify user exists
    if (!user) {
      return res.status(200).json({
        success: false,
        status: 404,
        message: 'User not found'
      });
    }

    // Fetch latest user data (in case of stale req.user)
    const currentUser = await UserModel.findById(user._id);
    if (!currentUser) {
      return res.status(200).json({
        success: false,
        status: 404,
        message: 'User not found'
      });
    }

    // Verify current password
    const isMatch = bcrypt.compare(currentPassword, currentUser.password);
    if (!isMatch) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: 'Current password is incorrect'
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: 'New password must be at least 8 characters'
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    currentUser.password = hashedPassword;
    await currentUser.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateNameandPhone = async (req, res) => {
  try {
    const { phone } = req.body
    const user = req.user;

    if (!user) {
      return res.status(200).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    if (!phone) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: "Phone number is required",
      });
    }

    const otp = crypto.randomInt(10000, 99999).toString();
    // Upsert OTP record in ForgotModal
    const expiresAt = new Date(Date.now() + 5 * 60 * 60 * 1000);

    const users = await UserModel.findById(user._id);

    // const currentUser = await UserModel.findByIdAndUpdate(
    //   user._id,
    //   { name, phone },
    //   { new: true, runValidators: true }
    // )
    // if (!currentUser) {
    //   return res.status(200).json({
    //     success: false,
    //     status: 404,
    //     message: "User not found",
    //   });
    // }
    await sendSms(phone, `Your OTP is: ${otp}`);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "OTP send successfully",
      expiresAt: expiresAt,
      users: users,
      OTP: otp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
    })
  }
}

const updateNameandPhoneVerification = async (req, res) => {
  try {
    const { phone, name } = req.body

    const user = req.user;

    if (!user) {
      return res.status(200).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    if (!name || !phone) {
      return res.status(200).json({
        success: false,
        status: 400,
        message: "Name and phone are required",
      });
    }
    const currentUser = await UserModel.findByIdAndUpdate(
      user._id,
      { name, phone },
      { new: true, runValidators: true }
    ).populate("pickupAddress").populate("payment");
    if (!currentUser) {
      return res.status(200).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    console.log({currentUser})

    return res.status(200).json({
      success: true,
      status: 200,
      message: "User Updated Successfully",
      user: currentUser
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
    })
  }
}

const editProfile = async (req, res) => {
  try {
    const user = req.headers['userid'];
    const { phone, name } = req.body
    if (!user) {
      return res.status(200).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }
    const currentUser = await UserModel.findByIdAndUpdate(
      user,
      { name, phone },
      { new: true, runValidators: true }
    )
    if (!currentUser) {
      return res.status(200).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      status: 200,
      message: "User Updated Successfully",
      user: currentUser
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
    })
  }
}

export {
  Register,
  VerifyEmail,
  Login,
  ForgotPassword,
  ForgotVerification,
  UpdateProfile,
  DeleteAccount,
  changePassword,
  updateNameandPhoneVerification,
  updateNameandPhone,
  phoneVerfication,
  verifyPhone,
  editProfile,
  ResetPassword
};
