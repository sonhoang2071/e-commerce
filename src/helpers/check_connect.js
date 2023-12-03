"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _TIME = 5000;
//count connect of database
const countConnect = () => {
    const numConnect = mongoose.connections.length;
    console.log(`Number of connections mongodb:: ${numConnect}`);
};

//check over load
const checkOverload = () => {
    setInterval(() => {
        const numConnect = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        //Example maximum number of connections is 5;
        const maxConnect = numCores * 5;

        console.log(`Active connections:: ${numConnect}`);
        console.log(`Memory usage::${memoryUsage / 1024 / 1024} MB`);
        if (numConnect > maxConnect) {
            console.log("Connection database overload detected");
        }
    }, _TIME); // Monitor every 5 seconds
};
module.exports = { countConnect, checkOverload };
