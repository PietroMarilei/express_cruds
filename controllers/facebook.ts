import { Router } from "express";
import express from "express";
import passport from "passport";
//import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
const FACEBOOK_ID = process.env.FACEBOOK_ID;
const FACEBOOK_KEY = process.env.FACEBOOK_KEY;

const router = express.Router();
passport.serializeUser(function (user: any, done) {
  done(null, user);
});

passport.deserializeUser(function (user: any, done) {
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_ID,
      clientSecret: FACEBOOK_KEY,
      callbackURL: "http://localhost:3000/facebook/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      
      console.log("auth facebook success!", profile);
      return done(null, profile);
    }
  )
);

router.get("/test", (req, res) => {
  console.log("res", res);

  res.json(["fb auth success!"]);
});

router.get("/", passport.authenticate("facebook"));




router.get(
  "/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  ( req, res) => {
    
    res.json("fb auth success!");
  }
);
export default router;