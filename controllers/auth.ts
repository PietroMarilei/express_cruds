import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { SECRET_KEY, usersFilePath } from "../config";
import { User } from "../db/users.interface"; 

require("dotenv").config();

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_KEY = process.env.GOOGLE_KEY;

const router = express.Router();

router.post("/register", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const users: User[] = require("../db/users.json"); 
  const newUser: User = {
    id: users.length + 1,
    username: username,
    password: password,
  };
  if (users.find((e: User) => e.username === username)) {
    return res.status(200).json({ error: "Choose an unique username!" });
  }
  users.push(newUser);

  fs.writeFileSync(usersFilePath, JSON.stringify(users));
  res.json(newUser);
});

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const users: User[] = require("../db/users.json"); 
  const user = users.find((e: User) => e.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Credenziali non valide" });
  }
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: "10h" }
  );
  console.log(token);
  res.json(token);
});

router.post("/logout", (req: Request, res: Response) => {
  // Cancellare il JWT qui se necessario
  res.json("Logged out");
});

//-----------------google
// src/routes.ts
import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";



passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_ID,
      clientSecret: GOOGLE_KEY,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Questa è la funzione di callback chiamata dopo l'autenticazione con Google
      // Puoi gestire il profilo dell'utente qui e autenticarlo nel tuo sistema
      // Ad esempio, puoi cercare o creare un utente nel tuo database e autenticarlo
      
      // 👍️ qui devo verificare se l'utente é nel db e generare il jwt per lui
      console.log("auth google success!", profile);
      return done(null, profile);
    }
  )
);

// Rotte per l'autenticazione con Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successo dell'autenticazione
    res.redirect("/");
  }
);

//-------------facebook log in 
import { Strategy as FacebookStrategy } from "passport-facebook";

passport.use(
  new FacebookStrategy(
    {
      clientID: 1189558458678663,
      clientSecret: "ee4d02fda39fef371442de6b72ac1b81",
      callbackURL: "http://localhost:3000/auth/facebook/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Logica per gestire l'autenticazione con Facebook
      // Includi la logica per cercare o creare un utente nel tuo sistema
      // e autenticarlo
      // 👍️ qui devo verificare se l'utente é nel db e generare il jwt per lui
      console.log("auth facebook success!");
    }
  )
);
router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    // Successo dell'autenticazione
    res.redirect("/");
  }
);
export default router;
