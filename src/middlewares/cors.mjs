const cors = (req, res, next) => {
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
}

export default cors;