const express = require("express");
const tasksController = require("../controllers/tasks");
const router = express.Router();

//GET localhost:8080/tasks
router.get("/", tasksController.getTasks);

// GET localhost:8080/tasks/:id
router.get("/:id", tasksController.getTaskById);

//Route to create a new task. All fields required. Return new task id in response body
router.post("/", tasksController.createTask);

//Update task. This route should allow for a url similar to this: api-url-path/tasks/id-to-modify.
router.put("/:id", tasksController.updateTask);

//Delete task. Return https status code showing deletion as successful
router.delete("/:id", tasksController.deleteTask);

module.exports = router;
