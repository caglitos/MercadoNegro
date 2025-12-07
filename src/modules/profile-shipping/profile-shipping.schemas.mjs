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
import z from 'zod';

export const createSchema = z.object({
	sellerId: z.string().min(1, { message: 'sellerId is required' }),
	name: z.string().min(1, { message: 'name is required' }),
	serviceLevel: z.enum(['standard', 'express', 'same_day', 'pickup']).optional(),
	priceRules: z.record(z.any()).optional(),
	dimensions: z.record(z.any()).optional(),
	enable: z.boolean().optional(),
})