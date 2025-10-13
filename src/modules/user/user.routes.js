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
import { authRequiered } from "../../middlewares/validateToken.js";
import { validateSchema } from "../../middlewares/validator.middleware.js";
import {
  register,
  login,
  logout,
  profile,
  deleteAccount,
  faVerification,
} from "./user.controller.js";
import { registerSchema } from "./user.schemas.js";
// import schemas

const router = Router();

router.post("/register", /*validateSchema(registerSchema),*/ register);

router.post("/login", /*validateSchema(loginSchema),*/ login);

router.post("/logout", logout);

router.get("/profile", authRequiered, profile);

router.delete("/delete-account/:id", authRequiered, deleteAccount);

// Ruta para verificación 2FA: añadir slash inicial
router.post("/verify-2fa", faVerification);

export default router;
