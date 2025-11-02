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
import { Router } from 'express';
import { authRequired } from '../../middlewares/validateToken.mjs';
import {
	validateBodySchema,
	validateParamsSchema
} from '../../middlewares/validator.middleware.mjs';
import {
	register,
	login,
	logout,
	profile,
	deleteAccount,
	faVerification,
	sellerRegister,
	getSellerById, changeUsername,
} from './user.controller.mjs';
import {
	registerSchema,
	loginSchema,
	deleteAccountBodySchema,
	deleteAccountParamsSchema,
	faVerificationSchema,
	sellerRegisterSchema,
	getSellerByID, changeUsernameSchema,
} from './user.schemas.mjs';

const router = Router();

router.post('/register', validateBodySchema(registerSchema), register);

router.post('/login', validateBodySchema(loginSchema), login);

router.post('/logout', logout);

router.get('/profile', authRequired, profile);

router.delete(
	'/delete-account/:id',
	validateBodySchema(deleteAccountBodySchema),
	validateParamsSchema(deleteAccountParamsSchema),
	deleteAccount
);

router.post('/verify-2fa', validateBodySchema(faVerificationSchema), faVerification);

router.put('/change-username', validateBodySchema(changeUsernameSchema), changeUsername);



// Seller
router.post(
	'/seller-register',
	authRequired,
	validateBodySchema(sellerRegisterSchema),
	sellerRegister
);

router.get(
	"/seller/:sellerId",
	validateParamsSchema(getSellerByID),
	getSellerById
)

export default router;
