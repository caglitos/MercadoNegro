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

// src/model/user.model.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        hashed_password: { type: String },
        display_name: { type: String },
        user_type: {
            type: String,
            enum: ["buyer", "seller", "both", "admin"],
            default: "buyer",
        },
        status: {
            type: String,
            enum: ["active", "suspended", "deleted", "pending"],
            default: "active",
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("User", userSchema);