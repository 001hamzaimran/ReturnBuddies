import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../../models/User.js";
import dotenv from 'dotenv'

dotenv.config()

passport.use(new GoogleStrategy({
    // clientID: process.env.GOOGLE_CLIENT_ID,
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('access',accessToken,'refreshToken',refreshToken)
        
        const user = await UserModel.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        const newUser = new UserModel({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            verified: true, // since Google is trusted
            profile: profile.photos[0].value
        });

        const savedUser = await newUser.save();
        done(null, savedUser);
    } catch (err) {
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    done(null, user);
});
