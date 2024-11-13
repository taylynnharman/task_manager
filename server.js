const express = require("express");
const app = express();
const mongoDB = require("./database/connect");
const taskRoutes = require("./routes/tasks");
//const myRoutes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors");
const corsOptions = {
  origin: "https://task-manager-92zb.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app
  .use(express.json())
  .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use(express.urlencoded({ extended: true }))
  //.use("/", myRoutes)
  .use("/tasks", taskRoutes)
  .use(cors(corsOptions))
  .use(
    session({ secret: "your-secret", resave: false, saveUninitialized: true })
  )
  .use(passport.initialize())
  .use(passport.session());

// Connect to MongoDB
mongoDB.connectDb();

// Initialize Passport.js
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function (token, tokenSecret, profile, done) {
      // Store user profile (you can save this to DB)
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user (how user data is stored in session)
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Start server on port 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
