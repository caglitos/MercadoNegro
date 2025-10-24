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

// src/model/review.model.js

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        reviewer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reviewed_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        rating: { type: Number, min: 1, max: 5, required: true },
        title: String,
        comment: String,
    },
    { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Review", reviewSchema);