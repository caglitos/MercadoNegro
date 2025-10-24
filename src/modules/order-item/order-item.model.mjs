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

// src/model/order-item.model.js

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    listing_id: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
    variation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ListingVariation",
    },
    product_snapshot: { type: Object, required: true },
    quantity: { type: Number, required: true },
    unit_price: { type: Number, required: true },
    currency: { type: String, required: true },
    discount_amount: { type: Number, default: 0.0 },
    total_line_amount: { type: Number, required: true },
});

export default mongoose.model("OrderItem", orderItemSchema);