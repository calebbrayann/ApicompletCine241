import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware pour vérifier le token JWT
const JWT_SECRET = process.env.JWT_SECRET;
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Accès refusé, token manquant ou invalide" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.clientId = decoded.id; // Stocker l'ID du client pour les requêtes suivantes
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Token invalide ou expiré" });
  }
};
export default verifyToken;
