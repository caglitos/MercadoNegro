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
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { createAccesToken } from '../../libs/jwt.mjs';
import User from './user.model.mjs';
import { EMAIL_FROM, EMAIL_PASS, EMAIL_USER } from '../../config.mjs';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

export const register = async (req, res) => {
    try {
        const { username, email, password, displayName } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const faCode = crypto.randomBytes(3).toString("hex").toUpperCase();

        const hashedFaCode = await bcrypt.hash(faCode, 10);

        const newUser = new User({
            email: email,
            hashed_faCode: hashedFaCode,
            faCodeExpiration: Date.now() + 900000, // 15 mins
        });

        await newUser.save();

        await transporter.sendMail({
            from: EMAIL_FROM, // sender address
            to: email,
            subject: "Bienvenido! Verifica tu email",
            html: `<h1>Gracias por registrarte</h1>
                   <p>Tu código de verificación es: <b>${faCode}</b></p>
                   <p>Este código tiene una duración de 15 minutos</p>`
        });

        const cookieOptions = {
            httpOnly: false, // Permite que JavaScript acceda a estas cookies
            sameSite: 'lax', // Permite cookies entre diferentes puertos del mismo dominio
            path: '/',
            maxAge: 15 * 60 * 1000 // 15 minutos
        };

        res.cookie("username", username, cookieOptions);
        res.cookie("passwordHash", hashedPassword, cookieOptions);
        res.cookie("displayName", displayName, cookieOptions);

        return res.status(200).json({message: "Codigo de verificacion enviado al email"});
    } catch (error) {
        try {
            const { email } = req.body;

            const userFound = await User.findOne({email});
			
			if (!userFound)
			    return res
			            .status(500)
			            .json({
			                message: "Error interno del servidor",
			                error: error,
			            });
			

			let userComplete = false;

			if (userFound.hashed_password)
				userComplete = true

			if (userComplete)
				return res.status(400).json({message: "El email ya esta registrado"});
			else {
				try {
					if (userFound.faCodeExpiration > Date.now())
						return res.status(400).json({message: "Tienes un codigo de verificacion activo, revisa tu email"});

					const faCode = crypto.randomBytes(3).toString("hex").toUpperCase();

					userFound.hashed_faCode = await bcrypt.hash(faCode, 10);
					userFound.faCodeExpiration = Date.now() + 900000; // 15 minutes

					await userFound.save();

					await transporter.sendMail({
						from: EMAIL_FROM, // sender address
						to: email,
						subject: "Bienvenido! Verifica tu email",
						html: `<h1>Gracias por registrarte</h1>
				    		<p>Tu código de verificación es: <b>${faCode}</b></p>
				    		<p>Este código tiene una duración de 15 minutos</p>`
					});
					return res
						.status(201)
						.json({message: "Codigo de verificacion enviado al email"});
				} catch (error) {

					return res
						.status(500)
						.json({message: "Error interno del servidor", error: error});
				}
			}
        } catch (error) {
            return res.status(500).json({
                message: "Error interno del servidor",
                error: error,
            });
        }
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userFound = await User.findOne({email});

        if (!userFound)
            return res.status(400).json({message: "El email no esta registrado aun"});

        const isMatch = await bcrypt.compare(password, userFound.hashed_password);

        if (!isMatch)
            return res.status(400).json({message: "Las contraseña es incorrecta"});

        const faCode = crypto
            .randomBytes(3)
            .toString("hex")
            .toUpperCase();

        const hashedFaCode = await bcrypt.hash(faCode, 10);

        await User.findByIdAndUpdate(
            userFound._id,
            {
                hashed_faCode: hashedFaCode,
                faCodeExpiration: Date.now() + 900000, // 15 minutes
            },
            {new: true}
        );

		await transporter.sendMail({
            from: EMAIL_FROM, // sender address
            to: email,
            subject: "Codigo de verificacion por dos factores para iniciar sesion",
            text: "Tu codigo de verificacion es: " + faCode, // plain‑text body
        });

        return res.status(201).json({message: "Codigo 2FA enviado al email"});
    } catch (error) {
        return res
            .status(500)
            .json({message: "Error interno del servidor", error: error});
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.clearCookie("UserId");
    return res.sendStatus(204);
};

export const profile = async (req, res) => {
    try {
        const { UserId } = req.cookies;

        if (!UserId) return res.status(404).json({message: "No autorizado: el id no fue encontrado"});

        const userFound =
            await User.findById(UserId)
                .select("-hashed_password -hashed_faCode -faCodeExpiration -__v -created_at -updated_at -_id");

		if (!userFound) return res.status(404).json({message: "No se encontro el usuario"});

        res.json(userFound);
	} catch (error) {
        return res
            .status(500)
            .json({message: "Error interno del servidor", error: error});
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const {UserId} = req.cookies;
        const {password} = req.body;

        const userFound = await User.findById(UserId);

		if (!userFound)
			return res
				.status(404)
				.json({
					message: "Usuario no encontrado"
				});

        const isMatch = await bcrypt.compare(password, userFound.hashed_password);

        if (!isMatch)
            return res.status(400).json({message: "La contraseña es incorrecta"});

        await User.findByIdAndDelete(UserId);

        res.clearCookie("token");
        res.clearCookie("UserId");
        res.clearCookie("username");
        res.clearCookie("passwordHash");
        res.clearCookie("displayName");

        res.sendStatus(200).json({message: "Cuenta eliminada correctamente"});
    } catch (error) {
        return res
            .status(500)
            .json({message: "Error interno del servidor", error: error});
    }
};

export const faVerification = async (req, res) => {
	console.log("Verificando 2FA...");
    try {
        const { email, code } = req.body;
        const { username, passwordHash, displayName } = req.cookies;

        if (!email || !code)
            return res.status(400).json({message: "Correo electronico y código son requeridos"});

        const userFound = await User.findOne({email});

        if (!userFound) return res.status(404).json({message: "Usuario no encontrado"});

        if (!userFound.hashed_faCode || userFound.faCodeExpiration === undefined)
            return res
                .status(400)
                .json({
                    message:
                        "No se ha solicitado un código de verificación," +
                        " solicita uno nuevo desde el apartado de registro" +
                        " o inicio de sesión.",
                });

        if (Date.now() > userFound.faCodeExpiration)
            return res
                .status(400)
                .json({
                    message: "El codigo de verificación ha expirado," +
                        " solicita uno nuevo desde el apartado de registro" +
                        " o inicio de sesión.",
                });

        const isMatch = await bcrypt.compare(code, userFound.hashed_faCode);

        if (!isMatch)
            return res.status(400).json({message: "El codigo es incorrecto."});
		
        await userFound.save();

        const token = await createAccesToken({id: userFound._id});

        if (username && passwordHash) {
            // guardar los datos que se almacenaron temporalmente en cookies
            userFound.username = username;
            userFound.hashed_password = passwordHash;
            userFound.display_name = displayName || username;

            // eliminar el código de verificación y su expiración

            res.clearCookie("username");
            res.clearCookie("passwordHash");
            res.clearCookie("displayName");
        }

        const tokenCookieOptions = {
            httpOnly: true, // El token debe ser httpOnly por seguridad
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        };

        const userIdCookieOptions = {
            httpOnly: false, // Permitimos acceso desde JavaScript si es necesario
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        };

        res.cookie("token", token, tokenCookieOptions);
        res.cookie("UserId", userFound._id.toString(), userIdCookieOptions);

        await transporter.sendMail({
            from: EMAIL_FROM,
            to: email,
            subject: "Gracias! verificaste tu email",
            html: `<h1>Gracias por Verificar</h1>
                <p>Tu código de verificación ha sido eliminado</p>`
        })

        userFound.hashed_faCode = null;
        userFound.faCodeExpiration = Date.now();

        await userFound.save();

        return res.json({
            message: "Verification successful",
            user: {
                id: userFound._id,
                username: userFound.username,
                email: userFound.email
            }
        });
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", error});
    }
};

export const changeUsername = async (req, res) => {
	try {
		const { password, newUsername } = req.body;
		const { UserId } = req.cookies;

        if (!password )
            return res
                    .status(400)
                    .json({
                        message: "La contraseña es requerida"
                    });

        if (!newUsername)
            return res
                    .status(400)
                    .json({
                        message: "El nuevo nombre de usuario es requerido"
                    });

		const userFound = await User.findById(UserId);

		const isMatch = await bcrypt.compare(password, userFound.hashed_password);

		if (!isMatch)
			return res
				.status(400)
				.json({ message: "La contraseña es incorrecta" });

		userFound.username = newUsername;

		await userFound.save();

		return res.status(200).json({
		    message: "El nombre de usuario ha cambiado a " + newUsername,
		});
	} catch (error) {
		return res.status(500).json({ message: "Error interno  del servidor", error });
	}
}

export const changeEmail = async (req, res) => {
	try {
		const { password, newEmail } = req.body;
		const { UserId } = req.cookies;

		if (!password )
			return res
				.status(400)
				.json({
					message: "La contraseña es requerida"
				});

		if (!newEmail)
			return res
				.status(400)
				.json({
					message: "El nuevo email es requerido"
				});

		const userFound = await User.findById(UserId);

		const isMatch = await bcrypt.compare(password, userFound.hashed_password);

		if (!isMatch)
			return res
				.status(400)
				.json({ g: "La contraseña es incorrecta" });

		userFound.email = newEmail;

		await userFound.save();
        
		return res.status(200).json({
		    message: "El email ha cambiado a " + newEmail,
		});
	} catch (error) {
		return res.status(500).json({ message: "Error interno del servidor", error });
	}
}

export const sellerRegister = async (req, res) => {
    try {
        const { UserId } = req.cookies;
        const { password } = req.body;

        const userFound = await User.findById(UserId);

        if (!userFound)
            return res.status(400).json({ message: "Usuario no encontrado" });

        const isMatch = bcrypt.compare(password, userFound.hashed_password);

        if (!isMatch)
            return res.status(400).json({ message: "La contraseña es incorrecta" });
        
        if (userFound.user_type === "both")
            return res.status(400).json({ message: "El usuario ya es un vendedor" });

        userFound.user_type = "both";

        const userSaved = await userFound.save();

		const sellerCookieOptions = {
            httpOnly: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        };

		res.cookie("sellerId", userSaved._id.toString(), sellerCookieOptions);

        return res.status(201).json({ 
            message: "Vendedor registrado con exito" ,
            email: userFound.email,
            username: userFound.username,
            userType: userSaved.user_type,
        });
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", error});
    }
};

export const getSellerById = async (req, res) => {
	try {
		const { sellerId } = req.params;

		if (!sellerId)
			return res.json({ message: "El Id es requerido" });

		const sellerFound =
			await User.findById(sellerId);

		if (!sellerFound)
			return res
				.status(404)
				.json({ message: "Vendedor no encontrado" });

		return res.status(200).json({
			message: "Vendedor encontrado",
			seller: sellerFound
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error interno del servidor", error });
	}
}