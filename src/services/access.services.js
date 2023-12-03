"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.services");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
    ConflictRequestError,
    UnauthorizedRequestError,
    ForbiddenRequestError
} = require("../core/error.response");
const { findByEmail } = require("./shop.services");
const roleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new ConflictRequestError("Shop already existed");
        }
        const hasPassword = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: hasPassword,
            roles: [roleShop.SHOP]
        });
        if (newShop) {
            // const { privateKey, publicKey } = crypto.generateKeyPairSync(
            //     "rsa",
            //     {
            //         modulusLength: 4096,
            //         publicKeyEncoding: {
            //             type: "pkcs1",
            //             format: "pem"
            //         },
            //         privateKeyEncoding: {
            //             type: "pkcs1",
            //             format: "pem"
            //         }
            //     }
            // );
            const privateKey = crypto.randomBytes(64).toString("hex");
            const publicKey = crypto.randomBytes(64).toString("hex");

            console.log(privateKey, publicKey);
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            });
            if (!keyStore) {
                return {
                    code: "xxx",
                    message: "keyStore error"
                };
            }
            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKey,
                privateKey
            );
            console.log(`Created Token Success::`, tokens);
            return {
                statusCode: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ["_id", "name", "email"],
                        object: newShop
                    }),
                    tokens
                }
            };
        }
        return {
            code: 200,
            metadata: null
        };
    };

    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new ConflictRequestError("Shop not registered");
        }
        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new UnauthorizedRequestError("Authenticated Error");
        }
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        const tokens = await createTokenPair(
            { userId: foundShop._id, email },
            publicKey,
            privateKey
        );
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        });
        return {
            statusCode: 201,
            metadata: {
                shop: getInfoData({
                    fields: ["_id", "name", "email"],
                    object: foundShop
                }),
                tokens
            }
        };
    };

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log({ delKey });
        return delKey;
    };
    static handleRefreshToken = async ({ refreshToken, user, keyStore }) => {
        const {userId, email} = user;
        if(keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.removeKeyByUserId(userId);
            throw new ForbiddenRequestError("Something wrong happend");
        }
        if(keyStore.refreshToken !== refreshToken) {
            throw new UnauthorizedRequestError("Unauthenticated");
        }
        const foundShop = findByEmail({email});
        if (!foundShop) {
            throw new UnauthorizedRequestError("Unauthenticated");
        }
        const tokens = await createTokenPair(
            { userId: foundShop._id, email },
            keyStore.publicKey,
            keyStore.privateKey
        );
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken       
            }
        });
        return {
            user,
            tokens
        };
        // if (!foundShop) {
        //     throw new UnauthorizedRequestError("Unauthenticated");
        // }
        // if (foundToken) {
        //     const { userId, email } = await verifyJWT(
        //         refreshToken,
        //         foundToken.privateKey
        //     );
        //     console.log({ userId, email });
        //     await KeyTokenService.removeKeyByUserId(userId);
        //     throw new ForbiddenRequestError("Something wrong happend");
        // }
        // const holdToken = await KeyTokenService.findByRefreshToken(refreshToken);
        // if (!holdToken) {
        //     throw new UnauthorizedRequestError("Unauthenticated");
        // }
        // // const { userId, email } = await verifyJWT(refreshToken, holdToken.privateKey);
        // const foundShop = findByEmail({email});
        // if (!foundShop) {
        //     throw new UnauthorizedRequestError("Unauthenticated");
        // }
        // const tokens = await createTokenPair(
        //     { userId: foundShop._id, email },
        //     holdToken.publicKey,
        //     holdToken.privateKey
        // );
        // await holdToken.updateOne({
        //     $set: {
        //         refreshToken: tokens.refreshToken
        //     },
        //     $addToSet: {
        //         refreshTokensUsed: refreshToken       
        //     }
        // });
        // return {
        //     user: { userId, email },
        //     tokens
        // };
    };
}

module.exports = AccessService;
