import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
//import { SECRET_KEY } from './config'; 

const SECRET_KEY = process.env.SECRET_KEY;

declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}

const auth = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header('jwt');
    console.log('jwt token ->', token);
    if (!token) {
        return res.status(401).json({ error: 'no token :(' });
    }
    try {
        const decoded: any = jwt.verify(token, SECRET_KEY); // Assicurati che il tipo di 'decoded' sia corretto rispetto ai dati decodificati dal token

        // Inserisci i dati dell'utente nella req
        req.user = { id: Number(decoded.userId), username: decoded.username };
        next();
    } catch (error) {
        console.error('error verify token->', error);
        return res.status(401).json({ error: 'not valid token' });
    }
};

export default auth;
