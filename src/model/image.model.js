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

// src/model/image.model.js

import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        owner_type: {
            type: String,
            enum: ["product", "listing", "user", "brand"],
            required: true,
        },
        owner_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        url: { type: String, required: true },
        alt_text: String,
        sort_index: { type: Number, default: 0 },
        is_primary: { type: Boolean, default: false },
    },
    { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Image", imageSchema);