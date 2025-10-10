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


// src/model/order.model.js

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        external_order_id: String,
        buyer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        billing_address_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
        },
        shipping_address_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
        },
        total_amount: { type: Number, required: true },
        currency: { type: String, default: "USD" },
        status: {
            type: String,
            enum: [
                "created",
                "paid",
                "shipped",
                "delivered",
                "cancelled",
                "refunded",
                "disputed",
            ],
            default: "created",
        },
        payment_status: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },
        shipping_status: {
            type: String,
            enum: ["not_shipped", "shipped", "in_transit", "delivered"],
            default: "not_shipped",
        },
        metadata: Object,
    },
    { timestamps: { createdAt: "placed_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Order", orderSchema);