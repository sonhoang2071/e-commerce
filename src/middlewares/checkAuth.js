"use strict";

const { findById } = require("../services/apikey.services");
const apikeyModel = require("../models/apikey.model");
const crypto = require("crypto");
const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization"
};

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: "Forbidden Error"
            });
        }
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden Error"
            });
        }
        req.objKey = objKey;
        return next();
    } catch (error) {}
};
const checkPermission = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permission) {
            return res.status(403).json({
                message: "Permission Error"
            });
        }
        const validPermission = req.objKey.permission.includes(permission);
        if(!validPermission) {
            return res.status(403).json({
                message: "Permission Error"
            });
        }
        return next();
    }
}
module.exports = {
    apiKey,
    checkPermission
};
