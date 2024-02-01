//------------------------------------------------ middleware
const jwt = require('jsonwebtoken');
const secretKey = "test-password"

const auth = (req, res, next) => {
    const token = req.header('jwt');
    if (!token) {
        return res.status(401).json({ error: 'no token :(' });
    }
    try {
        const decoded = jwt.verify(token, secretKey)
        // lo posso anche rendere disponibile in sessione
        // req.session.user = { id: decoded.userId, username: decoded.username };
        //infilo nella req i dati dell'user
        req.user = { id: decoded.userId, username: decoded.username }
        next()
    } catch (error) {
        console.error('error verify token->', error);
        return res.status(401).json({ error: 'not valid token' });
    }
}

module.exports = auth