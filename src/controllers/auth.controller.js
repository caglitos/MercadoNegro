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
import User from "../models/user.model.js";
import {createAccesToken} from "../libs/jwt.js";

// this template function handles user registration without database operations
export const register = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        // Check if the user existe by email

        // hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create a new user with model, using the hashed password, email and username
        // Save the new user to de database
        // Create a token
        const token = await createAccesToken({id: 0 /*userSaved._id*/});

        res.cookie("token", token);

        // Respond with the user ID, username and email

        res.status(200);
    } catch (error) {
        try {
            // Check if the user existe by email
            if (0/*userFoud*/) return res.status(400).json({message: "The email already exists"});
        } catch (error) {
            return res.status(500).json({message: "Internal Server Error", error: error});
        }

        return res.status(500).json({message: "Internal Server Error", error: error});
    }
};

// this template function handles user login without database operations
export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        // Find the user by email1

        // If the user does not exist, return a 404 error
        if (0/*!userFound*/) return res.status(404).json({message: "User not found"});

        const isMatch = await bcrypt.compare(password, userFound.password);

        if (!isMatch) return res.status(401).json({message: "Invalid credentials"});

        // Using the user ID, create a token
        const token = await createAccesToken({id: 0/*userFound._id*/});

        res.cookie("token", token);
        res.cookie("UserId", 0/*userFound._id*/);
        // Respond with the user ID, username and email
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const logout = (req, res) => {
    // No cheange is needed here
    res.cookie("token", "", {expires: new Date(0)});
    res.cookie("UserId", "", {expires: new Date(0)});
    return res.sendStatus(200);
};

// this template function handles user profile retrieval without database operations
export const profile = async (req, res) => {
    // Find the user by ID with the params or cookies

    // If the user does not exist, return a 404 error
    if (0/*!userFound*/) {
        return res.status(404).json({message: "User not found"});
    }

    return res.json({
        id: userFound._id, username: userFound.username, email: userFound.email,
    });
};
