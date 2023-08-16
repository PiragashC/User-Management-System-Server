const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan("tiny"));
app.use(require("cors")());
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);


app.listen(port, async() => {
    await connectDb();
    console.log(`server running on port ${port}`);
});