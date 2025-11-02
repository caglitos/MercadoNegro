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
import { Router } from "express";
import { authRequired } from "../../middlewares/validateToken.mjs";
import {
	validateBodySchema,
	validateParamsSchema
} from "../../middlewares/validator.middleware.mjs";
import {
	createSchema,
	getBySellerSchema,
	getByIdSchema,
	getByCategorySchema,
	getByBrandSchema,
	getBySellerNameSchema, modifyProductParamsSchema, modifyProductBodySchema,
} from './product.schemas.mjs';
import {
	create,
	getBySeller,
	getByID,
	getByCategory,
	getByBrand,
	getBySellerName, getRandomProducts, modifyProduct,
} from './product.controller.mjs';

const router = Router();

router.post(
	"/create",
	authRequired,
	validateBodySchema(createSchema),
	create
);

router.put(
	"/modify/:productId",
	validateParamsSchema(modifyProductParamsSchema),
	validateBodySchema(modifyProductBodySchema),
	authRequired,
	modifyProduct
)

router.get(
	"/getBySeller/:sellerId",
	validateParamsSchema(getBySellerSchema),
	getBySeller
)

router.get(
    "/getBySellerName/:sellerName",
    validateParamsSchema(getBySellerNameSchema),
    getBySellerName
);

router.get(
	"/getByID/:productId",
	validateParamsSchema(getByIdSchema),
	getByID
)

router.get(
    "/getByCategory/:categoryName",
    validateParamsSchema(getByCategorySchema),
    getByCategory
);

router.get(
    "/getByBrand/:brandName",
    validateParamsSchema(getByBrandSchema),
	getByBrand
);

router.get(
    "/getRandomProducts",
    getRandomProducts
);

export default router;
