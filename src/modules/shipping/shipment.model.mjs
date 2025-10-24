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

// src/model/shipment.model.js

import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        shipment_provider: String,
        service: String,
        tracking_number: String,
        label_url: String,
        status: {
            type: String,
            enum: [
                "pending",
                "shipped",
                "in_transit",
                "out_for_delivery",
                "delivered",
                "exception",
            ],
            default: "pending",
        },
        shipped_at: Date,
        delivered_at: Date,
        estimated_delivery_at: Date,
    },
    { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Shipment", shipmentSchema);