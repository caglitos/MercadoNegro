export const validateSchema = (schema) => (req, res, next) => {
    try {
        // Válida completamente el objeto req
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        next();
    } catch (error) {
        // Error de validación de Zod
        if (error.errors) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        // Otro tipo de error
        return res.status(400).json({
            message: "Unknown validation error",
            error: error,
        });
    }
};
