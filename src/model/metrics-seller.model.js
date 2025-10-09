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

// src/model/metrics-seller.model.js

import mongoose from "mongoose";

const sellerMetricsSchema = new mongoose.Schema(
    {
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        metric_date: { type: Date, required: true },
        sales_count: { type: Number, default: 0 },
        cancellations: { type: Number, default: 0 },
        on_time_shipping_rate: Number,
        average_rating: Number,
        raw: Object,
    },
    { timestamps: { createdAt: "created_at" } }
);

sellerMetricsSchema.index({ seller_id: 1, metric_date: 1 }, { unique: true });

export default mongoose.model("SellerMetric", sellerMetricsSchema);