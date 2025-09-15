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
import authRoutes from "./routes/auth.routes.js";
import dataRoutes from "./routes/userData.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", authRoutes);
app.use("/api/datas", dataRoutes);

export default app;
