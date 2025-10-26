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

const objectId = z.string().length(24, 'El ID debe tener 24 caracteres');

export const createSchema = z.object({
	categoryId: z.string()
		.length(24, 'El ID de la categoría debe tener 24 caracteres')
		.optional(),
	brandId: z.string()
		.length(24, 'El ID de la marca debe tener 24 caracteres')
		.optional(),
	title: z.string()
		.min(1, 'El título es obligatorio'),
	subtitle: z.string()
		.optional(),
	shortDescription: z.string()
		.optional(),
	longDescription: z.string()
		.optional(),
	condition: z.enum(
		[
			'new',
			'used',
			'refurbished'
		])
		.optional(),
	status: z.enum(
		['draft',
			'published',
			'paused',
			'closed'
		])
		.optional(),
});

export const getByIdSchema = z.object({
	productId: objectId,
});

export const getBySellerSchema = z.object({
	sellerId: objectId,
});

export const getBySellerNameSchema = z.object({
	sellerName: z.string().min(1, 'El nombre del vendedor es obligatorio'),
})

export const getByCategorySchema = z.object({
	categoryName: z.string().min(1, 'El nombre de la categoría es obligatorio'),
});

export const getByBrandSchema = z.object({
	brandName: z.string().min(1, 'El nombre de la marca es obligatorio'),
});

export const searchProductsSchema = z.object({
	query: z.string().min(1, 'El término de búsqueda es obligatorio'),
});
