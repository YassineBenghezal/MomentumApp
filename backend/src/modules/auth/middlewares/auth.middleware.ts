import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../../../types/extendedRequest.types';

interface JwtPayload {
    id: number;
    username: string;
}

export const authenticateUser = (
    req: AuthenticatedRequest, // Utilisation du type personnalisé
    res: Response,
    next: NextFunction
): void => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Access token is missing' });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
