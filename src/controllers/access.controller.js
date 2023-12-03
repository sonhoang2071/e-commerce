"use strict";

const {
    CreatedRequestSuccess,
    OkRequestSuccess
} = require("../core/success.response");
const AccessService = require("../services/access.services");

class AccessController {
    handleRefreshToken = async (req, res, next) => {
        new OkRequestSuccess({
            message: "Get Tokens OK",
            metadata: await AccessService.handleRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res);
    };
    login = async (req, res, next) => {
        new OkRequestSuccess({
            message: "Login Ok",
            metadata: await AccessService.login(req.body)
        }).send(res);
    };
    signUp = async (req, res, next) => {
        new CreatedRequestSuccess({
            message: "Registered OK",
            metadata: await AccessService.signUp(req.body)
        }).send(res);
    };
    logout = async (req, res, next) => {
        new OkRequestSuccess({
            message: "Logout Ok",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    };
}

module.exports = new AccessController();
