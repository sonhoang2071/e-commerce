"use strict";

const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils");
const {
    UnauthorizedRequestError,
    NotfoundRequestError
} = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.services");
const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
    CLIENT_ID: "x-client-id",
    REFRESH_TOKEN: "x-refresh-token"
};
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await jwt.sign(payload, publicKey, {
            expiresIn: "2 days"
        });
        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: "7 days"
        });
        jwt.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error("error verify::", err);
            } else {
                console.log("decode verify::", decode);
            }
        });
        return { accessToken, refreshToken };
    } catch (error) {}
};
const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]?.toString();
    if (!userId) {
        throw new UnauthorizedRequestError("Invalid Request");
    }
    const keyStore = await findByUserId(userId);

    if (!keyStore) {
        throw new NotfoundRequestError("Not Found");
    }
    if (req.headers[HEADER.REFRESH_TOKEN]) {
        const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
        try {
            const decode = jwt.verify(refreshToken, keyStore.privateKey);
            console.log({ decode });
            if (userId !== decode.userId) {
                throw new UnauthorizedRequestError("Invalid Request");
            }
            req.user = decode;
            req.refreshToken = refreshToken;
            req.keyStore = keyStore;
            return next();
        } catch (error) {
            throw error;
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
        throw new UnauthorizedRequestError("Invalid Request");
    }

    try {
        const decode = jwt.verify(accessToken, keyStore.publicKey);
        console.log({ decode });
        if (userId !== decode.userId) {
            throw new UnauthorizedRequestError("Invalid Request");
        }
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error;
    }
});
const verifyJWT = async (token, keySecret) => {
    return await jwt.verify(token, keySecret);
};
module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
};
