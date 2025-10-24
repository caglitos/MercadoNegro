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

// src/schemas/address.schemas.js

import z from "zod";

const bodySchema = z.object({
    user_id: z.string({
        required_error: "User ID is required",
        invalid_type_error: "User ID must be a string",
    }),
    label: z.string(),
    contact_name: z.string(),
    phone: z.string(),
    street: z.string(),
    number: z.string(),
    complement: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string(),
    geo_lat: z.number(),
    geo_lon: z.number(),
});

export const createAddressSchema = z.object({
    body: bodySchema,
});

export const updateAddressSchema = z.object({
    params: z.object({
        addressId: z.string({
            required_error: "Address ID is required",
            invalid_type_error: "Address ID must be a string",
        }),
    }),
    body: bodySchema,
});

export const deleteAddressSchema = z.object({
    params: z.object({
        addressId: z.string({
            required_error: "Address ID is required",
            invalid_type_error: "Address ID must be a string",
        }),
    }),
});

export const getAddressSchema = z.object({
    params: z.object({
        addressId: z.string({
            required_error: "Address ID is required",
            invalid_type_error: "Address ID must be a string",
        }),
    }),
});