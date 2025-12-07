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
import ShippingProfile from './profile-shipping.model.mjs';

export const create = async (req, res) => {
	try {
		const { sellerId, name, serviceLevel, priceRules, dimensions, enable } = req.body;

		const newProfile = new ShippingProfile({
			seller_id: sellerId,
			name,
			service_level: serviceLevel,
			price_rules: priceRules,
			dimensions,
			enabled: enable,
		});

		await newProfile.save();

		return res.status(200).json({
			message: 'Funcionalidad de creación de perfil de envío no implementada aún', newProfile,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Error interno del servidor', error });
	}
};