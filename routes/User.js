import express from "express";
import {
  changePassword,
  DeleteAccount,
  editProfile,
  ForgotPassword,
  ForgotVerification,
  Login,
  phoneVerfication,
  Register,
  registerDevice,
  ResetPassword,
  updateNameandPhone,
  updateNameandPhoneVerification,
  UpdateProfile,
  VerifyEmail,
  verifyPhone,
} from "../controllers/userControllers.js";
import validate from "../validations/validate.js";
import {
  authSchema,
  EmailSchema_validation,
  loginSchema,
} from "../validations/auth.schema.js";
import passport from "passport";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { isLogin } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/Multer.js";
import UserModel from "../models/User.js";
import {
  appleLogin,
  googleLogin,
} from "../controllers/GoogleAuth.Controller.js";

const AuthRoutes = express.Router();

AuthRoutes.post("/register-device", isLogin,registerDevice);
AuthRoutes.post("/register", upload.none(), validate(authSchema), Register);
AuthRoutes.post("/verifyemail", validate(EmailSchema_validation), VerifyEmail);
AuthRoutes.post("/login", upload.none(), validate(loginSchema), Login);
AuthRoutes.post("/forgot-password", upload.none(), ForgotPassword);
AuthRoutes.post(
  "/forgot-verfication",
  upload.none(),
  validate(EmailSchema_validation),
  ForgotVerification
);
AuthRoutes.post("/reset-password", upload.none(), ResetPassword);
// AuthRoutes.post('/Update-Password',upload.none(),validate(loginSchema),UpdatePassword)
AuthRoutes.post("/update-profile", upload.none(), isLogin, UpdateProfile);
AuthRoutes.post("/delete-account", upload.none(), isLogin, DeleteAccount);
AuthRoutes.post("/change-password", upload.none(), isLogin, changePassword);
AuthRoutes.post("/updatePhone", upload.none(), isLogin, updateNameandPhone);
AuthRoutes.post(
  "/updateNameandPhoneVerification",
  upload.none(),
  isLogin,
  updateNameandPhoneVerification
);
AuthRoutes.post("/phoneVerfication", upload.none(), isLogin, phoneVerfication);
AuthRoutes.post("/verifyPhone", upload.none(), isLogin, verifyPhone);
AuthRoutes.post("/editProfile", upload.none(), isLogin, editProfile);

// AuthRoutes.post("/Login-with-google",async(req,res)=>{
//     const client = new OAuth2Client('534353170936-2srgu9lugf0co1bmp30u6esno0ro6d6h.apps.googleusercontent.com');
//     const { idToken } = req.body;
//    try {

//       const ticket = await client.verifyIdToken({
//       idToken,
//       audience: '534353170936-2srgu9lugf0co1bmp30u6esno0ro6d6h.apps.googleusercontent.com', // same for both app and web
//     });
//        const payload = ticket.getPayload();
//        console.log('payload',payload)
//     const { email, name, picture, sub } = payload;
//         const user=await UserModel.findOne({email})

//         if(!user){
//             const newUser=new UserModel({
//                 name,
//                 email,
//                 profile:picture,
//                 googleId:sub
//             })
//             await newUser.save()
//             const token=await jsonwebtoken.sign({id:newUser._id}, process.env.JWT_SECRET, {expiresIn:"1d"})
//             return res.status(200).json({message:"User Login successfully", status:200, success:true, user, token})
//         }else{
//             const token=await jsonwebtoken.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"1d"})
//             return res.status(200).json({message:"User Login successfully", status:200, success:true, user, token})
//         }
//    } catch (error) {

//    }
// })

AuthRoutes.post("/Login-with-google", googleLogin);
AuthRoutes.post("/Login-with-apple", appleLogin);
AuthRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Callback after login
AuthRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // You can now send token to frontend
    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log("googleuser", user);
    console.log("googletoke", token);

    res
      .status(200)
      .json({
        message: "User Login successfully",
        status: 200,
        success: true,
        user,
        token,
      });
    // res.redirect(`http://localhost:3000/login/success?token=${token}`)
  }
);

export default AuthRoutes;
