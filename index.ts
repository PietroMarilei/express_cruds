import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from "cors";


const app = express();
const port = 3000;
const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json());

// ciclo per scrivere dinamicamente i controller
fs.readdirSync('./controllers').forEach(file => {
    console.log('Controller: ', file);

    const controllerName = path.parse(file).name;

    console.log('endpoint: ', `/${controllerName}`);

    app.use(`/${controllerName}`, require(`./controllers/${file}`).default);
});

app.listen(port, () => {
    console.log(`MY_API listening on port ${port}`);
});
