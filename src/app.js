const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const errorHandler = require("./middleware/error");

const corsOptions = {
    origin: ['http://localhost:3000', 'https://nivakcloud.netlify.app'],
    credentials: true,
};

// Import Routes
const auth = require('./routes/auth');

// Connect Database
mongoose.connect(process.env.DATABASE, {})
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes Middleware
app.use("/api", auth);

// Error Middleware
app.use(errorHandler);

/*app.listen(8000, () => {
    console.log("Port running on 8000");
})*/

module.exports = app;
