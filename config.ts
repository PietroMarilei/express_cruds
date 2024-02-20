import path from 'path';

const todosFilePath: string = path.join(__dirname, 'db', 'todos.json');
const usersFilePath: string = path.join(__dirname, 'db', 'users.json');

// export const SECRET_KEY: string = "TEST";
export { todosFilePath, usersFilePath };
