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

// src/model/promotion.model.js

import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
    {
        seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true },
        code: { type: String, unique: true },
        promotion_type: {
            type: String,
            enum: ["percentage", "fixed_amount", "free_shipping", "buy_x_get_y"],
            required: true,
        },
        value: Number,
        conditions: Object,
        valid_from: Date,
        valid_to: Date,
        active: { type: Boolean, default: true },
    },
    { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Promotion", promotionSchema);