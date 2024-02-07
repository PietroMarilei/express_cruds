import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { SECRET_KEY, usersFilePath } from "../config";
import { User } from "../db/users.interface"; // Importa l'interfaccia User



const router = express.Router();

router.post("/register", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const users: User[] = require("../db/users.json"); // Assicurati che il tipo di dati users sia corretto rispetto al tuo modello User
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
  const users: User[] = require("../db/users.json"); // Assicurati che il tipo di dati users sia corretto rispetto al tuo modello User
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

export default router;
