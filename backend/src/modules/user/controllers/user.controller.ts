import { Response } from 'express';
import { fetchUserInfo } from '../services/user.service';
import { AuthenticatedRequest } from '../../../types/extendedRequest.types';

export const getUserInfo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user = await fetchUserInfo(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
};
