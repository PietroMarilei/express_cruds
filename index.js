const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const path = require('path');

app.use(express.json())
// per scrivere nel file ci serve il percorso
const todosFilePath = path.join(__dirname, 'db', 'todos.json');
//mentre questo é il file
let todos = require("./db/todos.json");

// read operation here
app.get('/', (req, res) => {
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
// create operation here
app.post('/addTodos', (req, res) => {
    //qua ci vanno le validazioni 
    todos.push(req.body);
    console.log(todos);

    fs.writeFileSync(todosFilePath, JSON.stringify(todos))

    res.json(todos)
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


