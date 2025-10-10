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

// src/model/shipping-option.model.js

import mongoose from "mongoose";

const shippingOptionSchema = new mongoose.Schema({
    shipping_profile_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShippingProfile",
        required: true,
    },
    carrier: { type: String, required: true },
    service_code: String,
    service_name: String,
    min_days: Number,
    max_days: Number,
    base_cost: Number,
    currency: String,
    metadata: Object,
});

export default mongoose.model("ShippingOption", shippingOptionSchema);