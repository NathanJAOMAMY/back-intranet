const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'MY_PRIVATE_KEY'; // <-- doit être identique à la génération du token

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token invalide' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Ajoute les infos utilisateur au req
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};