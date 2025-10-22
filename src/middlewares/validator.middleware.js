export const validateBodySchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ error: error.errors.map((error) => error.message) });
    }
};

export const validateParamsSchema = (schema) => (req, res, next) => {
	try {
		schema.parse(req.params);
		next();
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ error: error.errors.map((error) => error.message) });
	}
};
