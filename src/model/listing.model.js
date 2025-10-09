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

// src/model/listing.model.js

import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sku: String,
        external_id: String,
        price: { type: Number, required: true },
        currency: { type: String, default: "USD" },
        available_quantity: { type: Number, default: 0 },
        reserved_quantity: { type: Number, default: 0 },
        warranty: String,
        listing_type: {
            type: String,
            enum: ["standard", "premium", "classified"],
            default: "standard",
        },
        buy_box: { type: Boolean, default: false },
        attributes: Object,
        shipping_profile_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShippingProfile",
        },
        status: {
            type: String,
            enum: ["active", "inactive", "deleted", "sold_out"],
            default: "active",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);