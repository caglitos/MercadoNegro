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
import z from "zod";

export const createPostSchema = z.object({
	productId: z.string().min(1, "productId is required"),
	sellerId: z.string().min(1, "sellerId is required"),
	sku: z.string().optional(),
	externalId: z.string().optional(),
	price: z.coerce.number().min(0, "price must be a positive number"),
	currency: z.string().optional().default("USD"),
	availableQuantity: z.coerce.number().min(0).optional().default(0),
	reservedQuantity: z.coerce.number().min(0).optional().default(0),
	warranty: z.string().optional(),
	listingType: z.enum(["standard", "premium", "classified"]).optional().default("standard"),
	buyBox: z.boolean().optional().default(false),
	attributes: z.record(z.any()).optional(),
	shippingProfileId: z.string().optional(),
	status: z.enum(["active", "inactive", "deleted", "sold_out"]).optional().default("active"),

});


export const getByProductSchema = z.object({
	productId: z.string().min(1, "productId is required"),
});