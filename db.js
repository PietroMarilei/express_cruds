const {usersFilePath,todosFilePath} = require("./config")

// let todos = require("./db/todos.json");
// let users = require("./db/users.json")

function fsWriteDB(filePath) {
    return function (data){
        fs.writeFileSync(filePath, JSON.stringify(data))
    }
}


module.exports = { 
    writeTodos: fsWriteDB(todosFilePath),
    writeUsers: fsWriteDB(usersFilePath),
}
