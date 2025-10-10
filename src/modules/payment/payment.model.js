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

// src/model/payment.model.js

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        payer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        payee_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: { type: Number, required: true },
        currency: { type: String, default: "USD" },
        method: String,
        provider: String,
        provider_transaction_id: String,
        status: {
            type: String,
            enum: ["initiated", "authorized", "captured", "failed", "refunded"],
            default: "initiated",
        },
        provider_response: Object,
    },
    { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Payment", paymentSchema);