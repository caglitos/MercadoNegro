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
import express from "express";
import cookieParser from "cookie-parser";
import user from "./modules/user/user.routes.mjs";
import product from "./modules/product/product.routes.mjs";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Basic CORS middleware to allow frontend dev server
app.use((req, res, next) => {
	const allowedOrigins = new Set([
		process.env.CORS_ORIGIN,
		"http://localhost:4000",
		"http://127.0.0.1:4000",
		"http://localhost:5173",
		"http://127.0.0.1:5173",
	].filter(Boolean));

	const origin = req.headers.origin;
	if (origin && allowedOrigins.has(origin))
		res.header("Access-Control-Allow-Origin", origin);
	// If no origin header or not in list, do not set ACAO to avoid reflecting arbitrary origins

	res.header("Access-Control-Allow-Credentials", "true");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.header(
		"Access-Control-Allow-Methods",
		"GET,POST,PUT,PATCH,DELETE,OPTIONS"
	);
	if (req.method === "OPTIONS") return res.sendStatus(204);
	next();
});

app.use("/api/user", user);
app.use("/api/product", product);

export default app;
