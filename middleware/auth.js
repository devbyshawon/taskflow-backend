const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer')) {
        return res.status(401).json({ message: 'No token, authorization denied'});   
    }

    const jwtToken = token.split(' ')[1];

    try {
        const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = decode;
        next();

    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'No token, authorization denied'});
    }
}

module.exports = { protect };