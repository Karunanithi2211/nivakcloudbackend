const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors")
const cookieParser = require('cookie-parser');
const errorHandler = require("./middleware/error")

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your client domain
    credentials: true,
};


// IMPORT ROUTES
const auth = require('./routes/auth')

// CONNECT DATABASE
mongoose.connect(process.env.DATABASE, {})
.then(() => console.log("DB Connected"))
.catch((err) => console.log(err))

// MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions))

// ROUTES MIDDLEWARE
app.use("/api",auth);

// ERROR MIDDLEWARE
app.use(errorHandler);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
})