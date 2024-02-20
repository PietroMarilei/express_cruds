import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from "cors";
import session from "express-session";


const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY
const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(session({
  secret: 'SECRET_KEY',
  // PERCHÉ NON PRENDE DA ENV ? 
  resave: false,
  saveUninitialized: true
}));

// ciclo per scrivere dinamicamente i controller
fs.readdirSync('./controllers').forEach(file => {
    console.log('Controller: ', file);

    const controllerName = path.parse(file).name;

    console.log('endpoint: ', `/${controllerName}`);

    app.use(`/${controllerName}`, require(`./controllers/${file}`).default);
});

app.listen(PORT, () => {
    console.log(`MY_API listening on PORT ${PORT}`);
});

