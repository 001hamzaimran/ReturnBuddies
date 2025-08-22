import UserModel from '../models/User.js';
import oauth2client from '../utils/googleConfig.js';
import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import appleSignin from "apple-signin-auth";

export const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: "Missing ID token", success: false });
        }

        const ticket = await oauth2client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { email, name, picture, sub } = payload;
        let user = await UserModel.findOne({ email });

        if (!user) {
            user = new UserModel({
                name,
                email,
                profile: picture,
                googleId: sub,
            });
            await user.save();
        }

        const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return res.status(200).json({
            message: "User login successful",
            status: 200,
            success: true,
            user,
            token,
        });
    } catch (error) {
        console.error('Google login error:', error);
        return res.status(500).json({ message: "Internal server error", success: false, status: 500 });
    }
};


export const appleLogin = async (req, res) => {
  try {
    const { idToken } = req.body; // Apple sends this from frontend

    if (!idToken) {
      return res.status(200).json({ message: "Missing ID token",status: 400, success: false });
    }

    // Verify the Apple ID token
    const applePayload = await appleSignin.verifyIdToken(idToken, {
      audience: process.env.APPLE_CLIENT_ID, // Your Service ID from Apple Dev
    });

    const { email, sub } = applePayload;
    let name = req.body.name || ""; // Apple only gives name on first login, so pass it from frontend if available

    // Find user by email or Apple sub
    let user = await UserModel.findOne({ email });

    if (!user) {
      user = new UserModel({
        name: name || "Apple User",
        email,
        profile: "",       // Apple doesn’t always send profile picture
        appleId: sub,
      });
      await user.save();
    }

    // Issue your own JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "User login successful",
      status: 200,
      success: true,
      user,
      token,
    });

  } catch (error) {
    console.error("Apple login error:", error);
    return res.status(500).json({ message: "Internal server error", success: false, status: 500 });
  }
};
