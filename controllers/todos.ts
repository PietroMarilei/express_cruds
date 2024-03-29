import express from "express";
import fs from "fs";
import path from "path";
import { todosFilePath } from "../config";
import { Todo } from "../db/todos.interface";
import todos from "../db/todos.json";
import auth from "../middleware";
import { writeTodos } from "../db";

const router = express.Router();

router.use(auth);

router.get("/getTodo", getUserTodos);
router.get("/getAllTodos", getAllTodos);
router.get("/getSingleTodo/:id", getSingleTodo)
router.post("/addTodo", addTodo);
router.post("/updateTodo/:id", updateTodo);
router.delete("/deleteTodo/:id", deleteTodo);

function getAllTodos(req: express.Request, res: express.Response) {
  res.json(todos);
}

function getUserTodos(req: express.Request, res: express.Response) {
  const userId: number = req.user.id;

  const todoList = todos.filter((e: Todo) => e.userId == userId);

  if (todoList.length <= 0) {
    return res.status(200).json({ error: "No todos found for this user" });
  }

  res.json(todoList);
}

function getSingleTodo(req: express.Request, res: express.Response) {

  const userTodos = todos.filter((e: Todo) => e.userId === req.user.id);

  const singleTodo = userTodos.filter((e: Todo) => e.id === req.body.id);

  res.json(singleTodo);
}

function addTodo(req: express.Request, res: express.Response) {
  const newTodo: Todo = req.body;
  newTodo.id = todos.length + 1;
  newTodo.userId = req.user.id;
  todos.push(req.body);

  writeTodos(todos);
  res.json(todos);
}

function updateTodo(req: express.Request, res: express.Response) {
  const id: number = Number(req.params.id);
  const updateData: Todo = req.body;
  updateData.userId = req.user.id;

  const userTodos = todos.filter((e: Todo) => e.userId === req.user.id);
  const indexToUpdate = userTodos.findIndex((e: Todo) => e.id == id);

  if (indexToUpdate === -1) {
    return res.status(404).json({ error: "No todo with this id" });
  }
  console.log("updated data->", updateData);
  console.log("todos[indextoupdate]->", todos[indexToUpdate]);
  //update just the relevant data
  todos[indexToUpdate].text = updateData.text;
  todos[indexToUpdate].done = updateData.done;

  writeTodos(todos);

  res.json(todos);
}

function deleteTodo(req: express.Request, res: express.Response) {
  const id: number = Number(req.params.id);

  if (req.body.userId !== req.user.id) {
    return res.status(401).json({ error: "You can't delete others' todos" });
  }

  //sovrascrittura del json
  const data = fs.readFileSync(todosFilePath, "utf-8");
  const todos = JSON.parse(data);
  const updatedTodos = todos.filter((e: { id: number }) => e.id !== id);

  if (updatedTodos.length === todos.length) {
    return res.status(404).json({ error: "Todo not found, try another id" });
  }

  writeTodos(todos);

  res.json(todos);
}

export default router;
