const { getDb } = require("../database/connect");
const { ObjectId } = require("mongodb");

const getTasks = async (req, res) => {
  try {
    const db = getDb();
    const tasksCollection = db.collection("tasks");
    const count = await tasksCollection.countDocuments();
    console.log("Number of documents in tasks collection:", count);

    // Fetch all tasks from the collection
    const tasks = await tasksCollection.find().toArray();

    // Respond with the fetched tasks
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Function to get a single task by ID
const getTaskById = async (req, res) => {
  const taskId = req.params.id;

  // Check if the taskId is a valid ObjectId
  if (!ObjectId.isValid(taskId)) {
    return res.status(400).json({ error: "Invalid task ID" }); // Return 400 for invalid ID format
  }

  try {
    const db = getDb();
    const tasksCollection = db.collection("tasks");

    // Attempt to find the task by ID
    const task = await tasksCollection.findOne({
      _id: new ObjectId(taskId),
    });

    if (!task) {
      return res.status(404).json({ error: "task not found" }); // Return 404 if not found
    }

    res.status(200).json(task); // Return the found task
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Failed to fetch task" }); // Return a 500 error
  }
};
/* CREATE task */
const createTask = async (req, res) => {
  console.log("req body", req.body);
  const task = {
    user_id: req.body.user_id,
    name: req.body.name,
    description: req.body.description,
    priority: req.body.priority,
    due_date: req.body.due_date,
    status: req.body.status,
    created_at: req.body.created_at,
  };
  console.log("task", task);
  try {
    const db = getDb();
    const response = await db.collection("tasks").insertOne(task);
    if (response.acknowledged) {
      res.status(201).json({ taskId: response.insertedId });
    } else {
      res.status(500).json({ error: "Failed to create the task." });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

/* UPDATE task */
const updateTask = async (req, res) => {
  const taskId = new ObjectId(req.params.id);
  const updatedtask = {
    user_id: req.body.user_id,
    name: req.body.name,
    description: req.body.description,
    priority: req.body.priority,
    due_date: req.body.due_date,
    status: req.body.status,
    created_at: req.body.created_at,
  };

  try {
    const db = getDb();
    const response = await db
      .collection("tasks")
      .updateOne({ _id: taskId }, { $set: updatedtask });
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "task updated successfully." });
    } else {
      res.status(404).json({ error: "No task found with that ID." });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

/* DELETE task */
const deleteTask = async (req, res) => {
  const taskId = new ObjectId(req.params.id);

  try {
    const db = getDb();
    const response = await db.collection("tasks").deleteOne({ _id: taskId });
    if (response.deletedCount > 0) {
      res.status(200).json({ message: "task deleted successfully." });
    } else {
      res.status(404).json({ error: "No task found with that ID." });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
