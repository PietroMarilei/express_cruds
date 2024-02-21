import { Router } from "express";
import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
const router = express.Router();
const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_KEY = process.env.GOOGLE_KEY;



passport.serializeUser(function (user: any, done) {
  done(null, user);
});

passport.deserializeUser(function (user: any, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_ID,
      clientSecret: GOOGLE_KEY,
      callbackURL: "http://localhost:3000/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      
      
      // 👍️ qui devo verificare se l'utente é nel db e generare il jwt per lui
      
      return done(null, profile);
    }
  )
);

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // console.log('auth google success-> req.user', req.user);
    
    res.json("google auth success!");
  }
);
export default router;
