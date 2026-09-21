const jwt = require('jsonwebtoken');
const blacklistModel = require('../models/blacklist.model');

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const isTokenBlacklisted = await blacklistModel.findOne({ token });

    if (isTokenBlacklisted) {
        return res.status(401).json({ message: 'Token is invalid, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = authUserMiddleware;