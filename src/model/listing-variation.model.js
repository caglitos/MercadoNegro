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

// src/model/listing-variation.model.js

import mongoose from "mongoose";

const listingVariationSchema = new mongoose.Schema(
    {
        listing_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },
        sku: String,
        attribute_values: Object,
        available_quantity: { type: Number, default: 0 },
        price: Number,
    },
    { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("ListingVariation", listingVariationSchema);