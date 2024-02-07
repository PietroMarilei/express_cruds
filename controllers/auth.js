const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const {SECRET_KEY, usersFilePath} = require('../config')
const users = require("../db/users.json")



router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const newUser = {
        "id": users.length + 1,
        "username": username,
        "password": password
    }
    if (users.find((e) => e.username == username)) {
        return res.status(200).json({ error: 'choose an unique username!' })
    }
    users.push(newUser)

    fs.writeFileSync(usersFilePath, JSON.stringify(users));
    res.json(newUser)
})
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((e) => e.username == username);

    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Credenziali non valide' });
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '10h' });
    console.log(token);
    res.json(token)
})

router.post('/logout', (req, res) => {
    // needs to delete jwt ?
    res.json('logged out')
})

module.exports = router