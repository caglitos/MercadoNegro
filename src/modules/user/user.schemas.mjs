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

export const registerSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    displayName: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const deleteAccountBodySchema = z.object({
    password: z.string(),
});

export const deleteAccountParamsSchema = z.object({
	id: z.string().length(24),
});

export const faVerificationSchema = z.object({
    email: z.string().email(),
    code: z.string().length(6),
});

export const changeUsernameSchema = z.object({
	newUsername: z.string(),
	password: z.string(),
});

export const sellerRegisterSchema = z.object({
    password: z.string(),
});

export const getSellerByID = z.object({
	sellerId: z.string().length(24),
});

