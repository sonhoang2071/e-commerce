"use strict";
const { StatusCodes, ReasonCodes } = require("./httpCode");

class SuccessResponse {
    constructor({ message, statusCode, reasonCode, metadata = {} }) {
        this.message = message;
        this.status = statusCode;
        this.metadata = metadata;
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}

class OkRequestSuccess extends SuccessResponse {
    constructor({
        message,
        statusCode = StatusCodes.OK,
        reasonCode = ReasonCodes.OK,
        metadata
    }) {
        super({ message,statusCode,reasonCode, metadata });
    }
}
class CreatedRequestSuccess extends SuccessResponse {
    constructor({
        message,
        statusCode = StatusCodes.CREATED,
        reasonCode = ReasonCodes.CREATED,
        metadata
    }) {
        super({ message,statusCode, reasonCode, metadata });
    }
}

module.exports = {
    OkRequestSuccess,
    CreatedRequestSuccess
};
