const express = require('express')
const router = express.Router();
const fs = require('fs');
const path = require('path');
const todosFilePath = path.join(__dirname, 'db', 'todos.json');

let todos = require("./db/todos.json");
let users = require("./db/users.json")
const auth = require('./middleware')
router.use(auth);

router.get('/getTodo/:id', getTodos)
router.post('/addTodo', addTodo)
router.post('/updateTodo/:id', updateTodo)
router.post('/deleteTodo/:id', deleteTodo)

function getTodos(req, res) {
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

function addTodo(req, res) {
    const newTodo = req.body
    newTodo.id = todos.length + 1
    newTodo.userId = req.user.id
    todos.push(req.body);

    fs.writeFileSync(todosFilePath, JSON.stringify(todos))

    //deve risp con solo i todo di quell'user, non con tutti
    res.json(todos)
}
//update
function updateTodo(req, res) {
    const id = req.params.id
    const updateData = req.body

    if (!isValidUpdateData(updateData)) {
        return res.status(400).json({ error: 'Invalid update data format' , updateData  });
    }
    
    updateData.userId = req.user.id

    //aggiorna solo quelli sull'id dell'user
    const userTodos = todos.filter(e => e.userId == req.user.id)
    
    const indexToUpdate = userTodos.findIndex((e) => e.id == id);

    if (indexToUpdate == -1) {
        return res.status(404).json({ error: 'no todo with this id' })
    }

    
    todos[indexToUpdate] = updateData

    fs.writeFileSync(todosFilePath, JSON.stringify(todos))

    //deve risp con solo i todo di quell'user, non con tutti
    res.json(todos)

}
//delete 
function deleteTodo (req, res)  {
    const id = req.params.id
    const updatedTodos = todos.filter((e) => e.id != id)


    todos = updatedTodos

    fs.writeFileSync(todosFilePath, JSON.stringify(todos))

    res.json(todos)
}



function isValidUpdateData(data) {
    if (!data || typeof data !== 'object') {
        return false;
    }
    const validKeysAndTypes = {
        id: 'number',
        done: 'boolean',
        text: 'string',
        userId: 'number'
    };

    // Verifica se tutte le chiavi nell'oggetto sono chiavi valide
    for (const key in data) {
        if (!validKeysAndTypes.hasOwnProperty(key)) {
            return false; // Chiave non valida trovata
        }

        // Verifica se il tipo di dato associato alla chiave è corretto
        if (typeof data[key] !== validKeysAndTypes[key]) {
            return false; // Tipo di dato non valido trovato
        }
    }
    return Object.keys(validKeysAndTypes).every(key => key in data);
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

