const express = require("express");
const app = express();
const mongoDB = require("./database/connect");
const taskRoutes = require("./routes/tasks");
//const myRoutes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const cors = require("cors");

app
  .use(express.json())
  .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use(express.urlencoded({ extended: true }))
  //.use("/", myRoutes)
  .use("/tasks", taskRoutes)
  .use(cors());

// Connect to MongoDB
mongoDB.connectDb();

// Start server on port 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
