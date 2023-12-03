"use strict";

const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");
class KeyTokenService {
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken
    }) => {
        try {
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // });
            // return token ? publicKeyString : null;
            const filter = { user: userId };
            const update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken
            };
            const options = { upsert: true, new: true };
            const tokens = await keytokenModel.findOneAndUpdate(
                filter,
                update,
                options
            );
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({
            user: new Types.ObjectId(userId)
        });
    };
    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne(id);
    };
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel
            .findOne({ refreshTokensUsed: refreshToken })
            .lean();
    };
    static removeKeyByUserId = async (userId) => {
        return await keytokenModel
            .deleteOne({ user: new Types.ObjectId(userId) })
            .lean();
    };
    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken });
    };
}

module.exports = KeyTokenService;
