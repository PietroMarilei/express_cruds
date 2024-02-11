import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { SECRET_KEY, usersFilePath } from "../config";
import { User } from "../db/users.interface"; 

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
      clientID:
        "625912430702-rhj0mfvsrna76rn8njvkv2vi4fig31r1.apps.googleusercontent.com",
      clientSecret: "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",
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


export default router;
