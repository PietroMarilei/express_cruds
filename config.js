
const path = require('path');

const todosFilePath = path.join(__dirname, 'db', 'todos.json');
const usersFilePath = path.join(__dirname, 'db', 'users.json');
module.exports = {
    SECRET_KEY: "TEST",
    todosFilePath,
    usersFilePath,

}