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
import Post from './post.model.mjs';

export const create = async (req, res) => {
	try {
		const {
			productId,
			sellerId,
			sku,
			externalId,
			price,
			currency,
			availableQuantity,
			reservedQuantity,
			warranty,
			listingType,
			buyBox,
			attributes,
			shippingProfileId,
			status,
		} = req.body;

		const newPost = new Post({
			product_id: productId,
			seller_id: sellerId,
			sku,
			external_id: externalId,
			price,
			currency,
			available_quantity: availableQuantity,
			reserved_quantity: reservedQuantity,
			warranty,
			listing_type: listingType,
			buy_box: buyBox,
			attributes,
			shipping_profile_id: shippingProfileId,
			status,
		});


		await newPost.save();

		return res.status(200).json({
			message: 'Publicacion creada exitosamente', data: {
				newPost,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error interno del servidor', error });
	}
};

export const getRandomPosts = async (req, res) => {
	try {
		const posts = await Post.aggregate([
			{ $match: { status: "active" } }, // filtra
			{ $sample: { size: 9 } },        // toma 9 al azar
		]);

		if (!posts || posts.length === 0)
			return res
				.status(404)
				.json({
					message: 'No se encontraron publicaciones',
				});

		return res.status(200).json({
			message: `${posts.length} Publicaciones aleatorios obtenidos exitosamente`,
			posts,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error interno del servidor', error });
	}
};

export const getByProduct = async (req, res) => {
	try {
		const { productId } = req.params;

        const post = await Post.find({ product_id: productId });

		if (!post || post.length === 0) {
			return res.status(404).json({
				message: "No se encontraron publicaciones para el producto especificado",
			});
		}

		return res.status(200).json({
		    message: "Publicacion obtenida exitosamente",
			post
		});
	} catch (error) {
		return res.status(500).json({ message: "Error interno del servidor", error });
	}
}