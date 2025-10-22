import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

	jwt.verify(token, TOKEN_SECRET, (err, user) => {
		if (err) return res.status(403).json({ message: "Invalid token" });

		req.user = user;
		next();
	});
};

export const sellerAuthRequired = (req, res, next) => {
	  const { token } = req.cookies;
	  if (!token)
		  	    return res.status(401).json({ message: "No token, authorization denied" });
	  jwt.verify(token, TOKEN_SECRET, (err, user) => {
		  if (err) return res.status(403).json({ message: "Invalid token" });
		  if (user.role !== 'both')
			  return res.status(403).json({ message: "Access denied, seller role required" });

		  req.user = user;
		  next();
	  });
};
