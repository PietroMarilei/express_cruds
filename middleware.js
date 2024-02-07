//------------------------------------------------ middleware
const jwt = require('jsonwebtoken');
const config = require ('./config')


const auth = (req, res, next) => {
    const token = req.header('jwt');
    console.log('jwt token ->',token);
    if (!token) {
        return res.status(401).json({ error: 'no token :(' });
    }
    try {
        const decoded = jwt.verify(token, config.SECRET_KEY)
    
        //infilo nella req i dati dell'user
        req.user = { id: decoded.userId, username: decoded.username }
        next()
    } catch (error) {
        console.error('error verify token->', error);
        return res.status(401).json({ error: 'not valid token' });
    }
}

module.exports = auth