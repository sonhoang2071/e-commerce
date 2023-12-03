"use strict";
const { StatusCodes, ReasonCodes } = require("./httpCode");

class ErrorRespone extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
class ConflictRequestError extends ErrorRespone {
    constructor(
        message = ReasonCodes.CONFLICT,
        statusCode = StatusCodes.CONFLICT
    ) {
        super(message, statusCode);
    }
}
class ForbiddenRequestError extends ErrorRespone {
    constructor(
        message = ReasonCodes.FORBIDDEN,
        statusCode = StatusCodes.FORBIDDEN
    ) {
        super(message, statusCode);
    }
}
class UnauthorizedRequestError extends ErrorRespone {
    constructor(
        message = ReasonCodes.UNAUTHORIZED,
        statusCode = StatusCodes.UNAUTHORIZED
    ) {
        super(message, statusCode);
    }
}
class NotfoundRequestError extends ErrorRespone {
    constructor(
        message = ReasonCodes.NOT_FOUND,
        statusCode = StatusCodes.NOT_FOUND
    ) {
        super(message, statusCode);
    }
}

module.exports = {
    ConflictRequestError,
    ForbiddenRequestError,
    UnauthorizedRequestError,
    NotfoundRequestError
};
