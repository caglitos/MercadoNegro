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

// src/model/product.model.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
        title: { type: String, required: true },
        subtitle: String,
        description: String,
        condition: {
            type: String,
            enum: ["new", "used", "refurbished"],
            default: "new",
        },
        status: {
            type: String,
            enum: ["draft", "published", "paused", "closed"],
            default: "draft",
        },
        published_at: Date,
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);