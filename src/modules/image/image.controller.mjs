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
import Image from './image.model.mjs';

export const Save = (req, res) => {
	try{
		const { ownerType, ownerId, imgURI, altText, sortIndex, isPrimary } = req.body;

		const newImage = new Image({
			owner_type: ownerType,
			owner_id: ownerId,
			url: imgURI,
			alt_text: altText,
			sort_index: sortIndex,
			is_primary: isPrimary
		});

		newImage.save().catch(err => {
			return res.status(500).json({ error: 'Error saving image', details: err });
		});

		return res.status(200).json({
			message: 'Image created successfully',
			image: newImage
		});
	} catch (error) {
	    return res.status(500).json({ error: 'Error creating image', details: error });
	}
}

export const getByOwner = async (req, res) => {
	try {
		const { ownerId } = req.params;

        const images = await Image.find({ owner_id: ownerId });

		return res.status(200).json({
		    message: `se encontraron ${images.length} imagenes`,
			images: images
		});
	} catch (error) {
		return res.status(500).json({ message: "Error interno del servidor", error });
	}
}

export const getMain = async (req, res) => {
	try {
		const { ownerId } = req.params;

        const imageFound =  await Image.findOne({ owner_id: ownerId, is_primary: true });

		return res.status(200).json({
		    message: "imagen encontrada con exito",
			images: imageFound
		});
	} catch (error) {
		return res.status(500).json({ message: "Error interno del servidor", error });
	}
}