import fs from 'fs';
import { usersFilePath, todosFilePath } from "./config";

function fsWriteDB(filePath: string) {
    return function (data: any) {
        fs.writeFileSync(filePath, JSON.stringify(data));
    };
}

export const writeTodos = fsWriteDB(todosFilePath);
export const writeUsers = fsWriteDB(usersFilePath);

