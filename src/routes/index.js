"use  strict";

const express = require("express");
const { apiKey, checkPermission } = require("../middlewares/checkAuth");
const router = express.Router();

//check ApiKey
router.use(apiKey);
//check PermissionShops
router.use(checkPermission('0000'));
router.use("/v1/api", require("./access"));

module.exports = router;
