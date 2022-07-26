import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json("A token is required for authentication.");
  }

  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decode;
  } catch (err) {
    return res.status(401).json("Invalid token");
  }

  return next();
};

export default verifyToken;
