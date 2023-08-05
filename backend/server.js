const { errorHandler } = require("./middleware/errorMiddleware");
const colors = require("colors");
const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

//connecting to database

connectDB();

const app = express();

//work around the cors error in the console while creating and submitting user to the database
var cors = require("cors");
app.use(cors());

//JSON body parsers to get the data from the body
// be able to send json format
app.use(express.json());
// be able to send urleconded format
app.use(express.urlencoded({ extended: false }));

app.get("/api/users", (req, res) => {
  res.status(200).json({ message: "Welcome to support desk application API" });
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));

app.use(errorHandler);

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));
