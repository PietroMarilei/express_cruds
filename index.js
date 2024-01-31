const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const secretKey  = "test-password"

app.use(express.json())
// per scrivere nel file ci serve il percorso
const todosFilePath = path.join(__dirname, 'db', 'todos.json');
const usersFilePath = path.join(__dirname, 'db', 'users.json');
//mentre questo é il file
let todos = require("./db/todos.json");
let users = require("./db/users.json")


const auth = require('./middleware')
const todosCRUD = require('./todos')
app.post('/register', (req,res)=> {
    const { username, password } = req.body;
    const users = require("./db/users.json")
    const newUser = {
        "id": users.length +1,
        "username" : username,
        "password" : password
    }
    if (users.find((e) => e.username == username)) {
        return res.status(200).json({ error: 'choose an unique username!' })
    }
    users.push(newUser)
   
    fs.writeFileSync(usersFilePath, JSON.stringify(users));
    res.json(newUser)
})
app.post('/login', (req,res)=>{
    const { username, password } = req.body;
    const user = users.find((e) => e.username == username);

    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Credenziali non valide' });
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    console.log(token);
    res.json(token)
})

// read operation here
// non deve darmi quelle del due 🔥

// app.post('/userTodoList/:id', auth, (req, res) => {
//     const id = req.params.id
//     const user = users.find((e) => e.id == id);
//     if (!user) {
//         return res.status(404).json({ error: 'not find user' })
//     }
//     const todoList = todos.filter(e => e.userId == id)
//     if (todoList.length == []) {
//         return res.status(200).json({ error: 'no todos, just relax' })
//     }
//     res.json(todoList)
// })
app.get('/', auth, (req, res) => {
    //res.send('Hello World!')
    res.json(todos)
})

app.get('/todos/:id', (req, res) => {
    const id = req.params.id
    const todo = todos.find((e) => e.id == id);

    if (!todo) {
        return res.status(404).json({ error: 'not find todo' })
    }

    res.json(todo)
})
app.get('/user/:id', (req,res)=>{
    const id = req.params.id
    const user = users.find((e) => e.id == id);
    if (!user) {
        return res.status(404).json({ error: 'not find user' })
    }
    res.json(user)
})


// create operation here
app.post('/addTodos', (req, res) => {
    //qua ci vanno le validazioni 
    todos.push(req.body);

    fs.writeFileSync(todosFilePath, JSON.stringify(todos))

    res.json(todos)
})
app.post('/addUser', (req, res) => {
    //qua ci vanno le validazioni 
    users.push(req.body);

    fs.writeFileSync(usersFilePath, JSON.stringify(users))

    res.json(users)
})

//update
app.post('/updateTodo/:id', (req, res) => {
    const id = req.params.id
    const updateData = req.body
    const indexToUpdate = todos.findIndex((e) => e.id == id);

    if(indexToUpdate == -1) {
        console.log(indexToUpdate);
        res.status(404).json({error:'cant find it bro'})
    }

    todos[indexToUpdate] = updateData

    fs.writeFileSync(todosFilePath, JSON.stringify(todos))

    res.json(todos)

})

//delete 

app.delete('/deleteTodo/:id', (req,res) => {
    const id = req.params.id
    const updatedTodos = todos.filter((e)=> e.id != id)

    
    todos = updatedTodos

    fs.writeFileSync(todosFilePath, JSON.stringify(todos))

    res.json(todos)
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


