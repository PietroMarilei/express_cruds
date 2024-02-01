const express = require('express')
const router = express.Router();
const fs = require('fs');
const path = require('path');

let todos = require("./db/todos.json");
let users = require("./db/users.json")

const auth = require('./middleware')
router.use(auth);

router.get('/:id', getTodo)

function getTodo(req,res) {
    const id = req.params.id
    const user = req.user

    if (!user || user.id != id) {
        return res.status(401).json({ error: 'you cant read others todos' })
    }

    const todoList = todos.filter(e => e.userId == id)

    if (todoList.length <= 0) {
        return res.status(200).json({ error: 'no todos, just relax' })
    }
    res.json(todoList)
}

module.exports = router

// router.post('/userTodoList/:id', auth, (req, res) => {
//     const id = req.params.id
//     const user = req.user

//     if (user.id != id) {
//         return res.status(401).json({ error: 'you cant read others todos' })
//     }

//     const todoList = todos.filter(e => e.userId == id)

//     if (todoList.length <= 0) {
//         return res.status(200).json({ error: 'no todos, just relax' })
//     }
//     res.json(todoList)
// })

// router.get('/todos/:id', (req, res) => {
//     const id = req.params.id
//     const todo = todos.find((e) => e.id == id);

//     if (!todo) {
//         return res.status(404).json({ error: 'not find todo' })
//     }

//     res.json(todo)
// })
// router.get('/user/:id', (req, res) => {
//     const id = req.params.id
//     const user = users.find((e) => e.id == id);
//     if (!user) {
//         return res.status(404).json({ error: 'not find user' })
//     }
//     res.json(user)
// })


// // create operation here
// router.post('/addTodos', (req, res) => {
//     //qua ci vanno le validazioni 
//     todos.push(req.body);

//     fs.writeFileSync(todosFilePath, JSON.stringify(todos))

//     res.json(todos)
// })


// //update
// router.post('/updateTodo/:id', (req, res) => {
//     const id = req.params.id
//     const updateData = req.body
//     const indexToUpdate = todos.findIndex((e) => e.id == id);

//     if (indexToUpdate == -1) {
//         console.log(indexToUpdate);
//         res.status(404).json({ error: 'cant find it bro' })
//     }

//     todos[indexToUpdate] = updateData

//     fs.writeFileSync(todosFilePath, JSON.stringify(todos))

//     res.json(todos)

// })

// //delete 

// router.delete('/deleteTodo/:id', (req, res) => {
//     const id = req.params.id
//     const updatedTodos = todos.filter((e) => e.id != id)


//     todos = updatedTodos

//     fs.writeFileSync(todosFilePath, JSON.stringify(todos))

//     res.json(todos)
// })

