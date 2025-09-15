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

// Descripción: Controladores para manejar operaciones CRUD en documentos de usuario.

// importar modelos y gestores de base de datos

export const getDatasByUser = async (req, res) => {
    const UserID = req.cookies.UserId;

    // Verificar que la cookie UserID está presente
    if (!UserID) return res.status(401).json({success: false, message: "UserID cookie is missing"});

    try{
        // Verificar que el UserID es un ObjectId válido según el gestor de base de datos

        // Si es válido, buscar documentos asociados a ese UserID

        return res.status(200).json({success: true, data: []}); // Reemplazar [] con los documentos encontrados
    }catch(err){
        return res.status(500).json({message: "Internal server error", error: err});
    }
}


// 2. Obtener un documento por ID (solo del usuario actual)
export const getDataByDataId = async (req, res) => {
    try {
        const {id} = req.params;
        // Buscar en la base de datos el ID y la clave foránea según el gestor de base de datos

        if (0 /*!document*/) {
            return res.status(404).json({success: false, message: "Documento no encontrado"});
        }

        res.status(200).json({success: true, data: document});
    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error", error: error});
    }
};

// 3. Crear documento (validación mínima de contenido)
export const createData = async (req, res) => {
    try {
        const {content} = req.body;

        if (content === undefined) {
            // Validación básica
            res.status(400).json({success: false, message: "Content cannot be empty"});
        }

        // Crear el documento en la base de datos con la clave foránea del usuario actual
        // Guardar en la base de datos según el gestor de base de datos

        res.status(201).json({success: true, data: 0/*newDocument*/});
    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error", error: error});
    }
};

// 4. Actualizar documento (solo del usuario actual)
export const updateData = async (req, res) => {
    try {
        const {id} = req.params;
        const {content} = req.body;
        const userId = req.cookie.userId; // Suponiendo que el middleware de autenticación establece req.userId

        //Validar que el documento a actualizar exista y sea del usuario, según el gestor de base de datos
        // Actualizar el documento en la base de datos según el gestor de base de datos

        if (0/*!updatedDoc*/) {
            return res.status(404).json({success: false, message: "Documento no encontrado"});
        }

        res.status(200).json({success: true, data: 0/*updatedDoc*/});
    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error", error: error});
    }
};

// 5. Eliminar documento (solo del usuario actual)
export const deleteData = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.cookie.userId;

        // Validar que el documento a eliminar exista y sea del usuario, según el gestor de base de datos
        // Eliminar el documento en la base de datos según el gestor de base de datos

        if (0/*deletedDoc*/) {
            return res.status(404).json({success: false, message: "Documento no encontrado"});
        }

        res.status(200).json({success: true, message: "Documento eliminado"});
    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error", error: error});
    }
};
