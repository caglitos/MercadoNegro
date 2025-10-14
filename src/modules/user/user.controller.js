/*
 * Copyright 2025 Carlos Rodrigo Briseño Ruiz
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import {createAccesToken} from "../../libs/jwt.js";
import User from "./user.model.js";
import {
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM,
} from "../../config.js";


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

export const register = async (req, res) => {
    try {
        const {username, email, password, displayName} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const faCode = crypto.randomBytes(4).toString("hex").toUpperCase();

        const newUser = new User({
            email: email,
            faCode,
            faCodeExpiration: Date.now() + 900000, // 15 minutes
        });

        await newUser.save();

        const info = await transporter.sendMail({
            from: EMAIL_FROM, // sender address
            to: email,
            subject: "Welcome! Verify your email",
            text: "your verification code is: " + faCode, // plain‑text body
        });

        res.cookie("username", username);
        res.cookie("passwordHash", hashedPassword);
        res.cookie("displayName", displayName);

        return res.status(201).json({message: "Verification code sent to email"});
    } catch (error) {
        try {
            const { email } = req.body;

            const userFound = await User.findOne({email});

            if (userFound)
                return res.status(400).json({message: "The email already exists"});
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error,
            });
        }

        return res
            .status(500)
            .json({message: "Internal Server Error", error: error});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const userFound = await User.findOne({email});

        if (!userFound)
            return res.status(400).json({message: "The email does not exists"});

        const isMatch = await bcrypt.compare(password, userFound.hashed_password);

        if (!isMatch)
            return res.status(400).json({message: "The password is incorrect"});

        const faCode = crypto.randomBytes(4).toString("hex").toUpperCase();

        await User.findByIdAndUpdate(
            userFound._id,
            {
                faCode,
                faCodeExpiration: Date.now() + 900000, // 15 minutes
            },
            {new: true}
        );


        const info = await transporter.sendMail({
            from: EMAIL_FROM, // sender address
            to: email,
            subject: "2FA",
            text: "your 2FA code is: " + faCode, // plain‑text body
        });

        console.log("Message sent:", info.messageId);

        return res.status(201).json({message: "2FA code sent to email"}); // Change to 200 in production
    } catch (error) {
        return res
            .status(500)
            .json({message: "Internal Server Error", error: error});
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.clearCookie("UserId");
    return res.sendStatus(204);
};

export const profile = async (req, res) => {
    try {
        const userFound = await User.findById(req.user.id).select(
            "-hashed_password"
        );

        if (!userFound) return res.status(404).json({message: "User not found"});

        res.json(userFound);
    } catch (error) {
        return res
            .status(500)
            .json({message: "Internal Server Error", error: error});
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const {id} = req.params;
        const {UserId} = req.cookies;
        const {password} = req.body;

        if (id !== UserId)
            return res
                .status(401)
                .json({message: "You are not authorized to delete this account"});

        const userFound = await User.findById(id);
        if (!userFound) return res.status(404).json({message: "User not found"});

        const isMatch = await bcrypt.compare(password, userFound.hashed_password);

        if (!isMatch)
            return res.status(400).json({message: "The password is incorrect"});

        await User.findByIdAndDelete(id);

        res.clearCookie("token");
        res.clearCookie("UserId");

        res.sendStatus(204);
    } catch (error) {
        return res
            .status(500)
            .json({message: "Internal Server Error", error: error});
    }
};

export const faVerification = async (req, res) => {
    try {
        const { email, code } = req.body;
        const { username, passwordHash, displayName } = req.cookies;

        if (!email || !code)
            return res.status(400).json({message: "Email and code are required"});

        const userFound = await User.findOne({email});

        if (!userFound) return res.status(404).json({message: "User not found"});

        if (!userFound.faCode || !userFound.faCodeExpiration)
            return res
                .status(400)
                .json({
                    message:
                        "No verification code found for this user. Please request a new one.",
                });

        if (Date.now() > userFound.faCodeExpiration)
            return res
                .status(400)
                .json({
                    message: "Verification code expired. Please request a new one.",
                });

        if (userFound.faCode !== code.toUpperCase())
            return res.status(400).json({message: "Invalid verification code"});

        const token = await createAccesToken({id: userFound._id});

        if (username && passwordHash) {
            userFound.username = username;
            userFound.hashed_password = passwordHash;
            userFound.display_name = displayName || username;
            await userFound.save();
        }

        res.cookie("token", token);
        res.cookie("UserId", userFound._id);

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            message: "Verification successful"
        });
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error});
    }
};
