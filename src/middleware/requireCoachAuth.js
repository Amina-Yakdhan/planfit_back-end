const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config/jwt');

const requireCoachAuth = (req, res, next) => {
    const authorization = req.headers.authorization || '';
    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Authentification requise.' });
    }

    try {
        req.coach = jwt.verify(token, JWT_SECRET);
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Session invalide ou expirée.' });
    }
};

module.exports = requireCoachAuth;
