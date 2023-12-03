"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check_connect");

const connectString = process.env.CONNECT_URI;

class Database {
    constructor() {
        this.connect();
    }
    connect(type = "mongodb") {
        if (true) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }
        mongoose
            .connect(connectString)
            .then((_) => {
                countConnect();
                console.log("Connected Database Success");
            })
            .catch((err) => console.log(err));
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;
