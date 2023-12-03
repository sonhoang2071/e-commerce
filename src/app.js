const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
require("dotenv").config();
const app = express();

//init middlewares
app.use(morgan("dev"));
// app.use(morgan("combined"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);
//init db
require("./database/init_mongodb");
const { checkOverload } = require("./helpers/check_connect");
checkOverload();
//init routes
app.use("/", require("./routes"));
//handling errors
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    const status = error.status || 500;
    console.log(error);
    return res.status(status).json({
        status: "error",
        code: status,
        message: error.message || "Internal Server Error"
    });
});
module.exports = app;
