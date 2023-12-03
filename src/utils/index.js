"use strict";
const lodash = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
    return lodash.pick(object, fields);
};

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = {
    getInfoData,
    asyncHandler
};
