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
import Product from "./product.model.js";

export const create = async (req, res) => {
    try {
        const {
            categoryId,
            brandId,
            title, 
            subtitle, 
            shortDescription, 
            longDescription,
            condition,
            status
          } = req.body;

		const sellerId = req.cookies.UserId;

        const newProduct = new Product({
			seller_id: sellerId,
            category_id: categoryId,
            brand_id: brandId,
            title,
            subtitle,
            short_description: shortDescription,
            long_description: longDescription,
            condition,
            status
        });

        await newProduct.save();

        return res.status(201).json({
			message: "Producto creado exitosamente",
			product: {
				seller_id: newProduct.seller_id,
				title: newProduct.title,
				subtitle: newProduct.subtitle,
				short_description: newProduct.short_description,
				long_description: newProduct.long_description,
				condition: newProduct.condition,
				status: newProduct.status,
				_id: newProduct._id
		}
		});
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor", error });
    }
}

export const getBySeller = async (req, res) => {
	try {
		const { sellerId } = req.params;

		if (!sellerId)
		    return res
		            .status(400)
		            .json({
		                message: "El id del vendedor es obligatorio"
		            });

		const products =
			await Product.find({ seller_id: sellerId })
				.select("-createdAt -updatedAt -__v");

		if (!products)
		    return res
		            .status(404)
		            .json({
		                message: "No se encontraron productos de este vendedor"
		            });



		return res.status(200).json({
			message: `Se han encontrado ${products.length} productos del vendedor`,
			products
		});
	} catch (error) {
		return res.status(500).json({ message: "Error interno del servidor", error });
	}
}

export const getBySellerName = async (req, res) => {
	try {
		const { sellerName } = req.params;

		if (!sellerName)
		    return res
		            .status(400)
		            .json({
		                message: "El nombre del vendedor es obligatorio"
		            });
		
		const products = 
			await Product.find({ seller_name: sellerName })
				.select("-createdAt -updatedAt -__v");
		
		if (!products)
		    return res
		            .status(404)
		            .json({
		                message: "No se encontraron productos de este vendedor"
		            });
		
		
		return res.status(200).json({
		    message: `Se han encontrado productos del vendedor ${sellerName}`,
			products: products
		});
	} catch (error) {
		return res.status(500).json({ message: "Error Interno del servidor", error });
	}
}

export const getByID = async (req, res) => {
	try {
	    const { productId } = req.param;


		if (!productId)
		    return res
		            .status(400)
		            .json({
		                message: "El ID del producto es obligatorio"
		            });

	    const productFound =
			await Product.findById(productId).select("-createdAt -updatedAt -__v");

		if (!productFound)
		    return res.status(404).json({message: "No se encontro el producto"});

	    return res.status(200).json({
			message: "Producto encontrado exitosamente",
			product: productFound
	    });
	} catch (error) {
	    return res.status(500).json({ message: "Error interno del servidor", error });
	}
}

export const getByCategory = async (req, res) => {
	try {
		const { categoryName } = req.params;

        if (!categoryName)
            return res
                    .status(400)
                    .json({
                        message: "EL Id es necesario"
                    });

		const products = await Product.find({ category_id: categoryName })
				.select("-createdAt -updatedAt -__v");

		if (!products)
		    return res
		            .status(404)
		            .json({
		                message: "No se encontraron productos en esta categoria"
		            });


		return res.status(200).json({
		    message: `Se han encontrado ${products.length} de la categoria`,
			productos: products
		});
	} catch (error) {
		return res.status(500).json({ message: "Error interno del servidor", error });
	}
}

export const getByBrand = async (req, res) => {
	try {
		const { brandName } = req.params;

        if (!brandName)
            return res
                    .status(400)
                    .json({
                        message: "El Id de la marca es necesario"
                    });

		const products = await Product.find({ brand_id: brandName })
			.select("-createdAt -updatedAt -__v");

		if (!products)
		    return res
		            .status(404)
		            .json({
		                message: "No se encontraron productos de esa marca"
		            });


		return res.status(200).json({
		    message: `Se han encontrado ${products.length} productos de la marca`,
			productos: products
		});
	} catch (error) {
		return res.status(500).json({ message: "Error interno del servidor", error });
	}
}
