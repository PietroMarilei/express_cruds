const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const secretKey = "test-password"

const auth = require('./middleware')

// read operation here
// non deve darmi quelle del due 🔥

app.post('/userTodoList/:id', auth, (req, res) => {
    const id = req.params.id
    const user = users.find((e) => e.id == id);
    if (!user) {
        return res.status(404).json({ error: 'not find user' })
    }
    const todoList = todos.filter(e => e.userId == id)
    if (todoList.length == []) {
        return res.status(200).json({ error: 'no todos, just relax' })
    }
    res.json(todoList)
})

