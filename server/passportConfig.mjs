import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

export default function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      // verify callback
      (accessToken, refreshToken, profile, done) => {
        // pass profile to callback handler in route
        return done(null, { profile, accessToken, refreshToken });
      }
    )
  );
}