import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getTask, getTasks, createTask, deleteTask, updateTask } from "../controllers/task.controllers.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createTaskSchema } from "../schemas/task.schemas.js";

const router = Router();

router.get("/tasks", authRequired, getTasks);

router.post("/tasks", authRequired, validateSchema(createTaskSchema), createTask);

router.delete("/tasks/:id", authRequired, deleteTask);

router.get("/tasks/:id", authRequired, getTask);

router.put("/tasks/:id", authRequired, updateTask);

export default router