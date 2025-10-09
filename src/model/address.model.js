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

// src/model/address.model.js

import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        label: String,
        contact_name: String,
        phone: String,
        street: String,
        number: String,
        complement: String,
        neighborhood: String,
        city: String,
        state: String,
        postal_code: String,
        country: String,
        geo_lat: Number,
        geo_lon: Number,
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Address", addressSchema);