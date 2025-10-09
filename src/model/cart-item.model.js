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

// src/model/cart-item.model.js

import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        cart_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
            required: true,
        },
        listing_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },
        variation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ListingVariation",
        },
        quantity: { type: Number, default: 1 },
        price_at_add: { type: Number, required: true },
        currency: { type: String, default: "USD" },
    },
    { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("CartItem", cartItemSchema);