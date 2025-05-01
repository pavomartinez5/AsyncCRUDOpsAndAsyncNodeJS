//Video Tutorail Link: https://www.youtube.com/watch?v=AWlLhRQJvtw&list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw&index=15
//Tutorail name: How to create MongoDB Schemas and Data Models | Node.js Tutorials for Beginners
//Continue on 30:13 to learn how to deploy

//Import dontenv to use the .env file
require("dotenv").config();

//Import express
const express = require("express");

//Call express and place it in the app variable
const app = express();

//Import common core modules
const path = require("path");

//Import Cors module -  Cross Origin Resource Sharing
const cors = require("cors");

//Import CorsOptions functions from the CorOptions.js in the config folder
const corsOptions = require("./config/corsOptions");

//Import custom log module
const { logger } = require("./middleware/logEvents");

//Import custom log module
const errorHandler = require("./middleware/errorHandler");

//Import cookieParser package
const cookieParser = require("cookie-parser");

//Import middleware verifyJWT
const verifyJWT = require("./middleware/verifyJWT");

//Import custom middleware credentials
const credentials = require("./middleware/credentials");

//Import mongoose module
const mongoose = require("mongoose");

//Import connection from dbConn.js file
const connectDB = require("./config/dbConn");

//Define port for webserver
const PORT = process.env.PORT || 3500;

//Connect to MongoDB
connectDB();

// Middleware
// to use middleware type, app.use , this is what we often use to apply middleware to all routes that are coming in

//Custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

//Use CORS - Cross Origin Resource Sharing
app.use(cors(corsOptions));

//built-in middleware to handle urlencoded data, in other words, from :data
//‘content-type: application/x-www-form-urlencoded’
//This is used to handle you url encoded data
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());

//add middleware for cookies
app.use(cookieParser());

//built-in middleware to to serve static files like CSS for the public directory
app.use("/", express.static(path.join(__dirname, "/public")));

//Route for the root directory
app.use("/", require("./routes/root"));

//Route for registers
app.use("/register", require("./routes/register"));

//Route for authorized user
app.use("/auth", require("./routes/auth"));

//Route for refresh end point
app.use("/refresh", require("./routes/refresh"));

//Route for logout end point
app.use("/logout", require("./routes/logout"));

//Use middleware verifyJWT after this point, anything below app.use(verifyJWT) will need to be verified
app.use(verifyJWT);

//Route for api employees
app.use("/employees", require("./routes/api/employees"));

//Route for api users
app.use("/users", require("./routes/api/users"));

//Redirect all incorrect traffic to a 404.html page
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

//CORS Error handling
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
