import { getUserById } from '../repositories/user.repository';

export const fetchUserInfo = async (userId: number) => {
    const user = await getUserById(userId);
    if (!user) throw new Error("Utilisateur non trouvé");
    return user;
};
