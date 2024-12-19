import prisma from '../../../config/prisma.client';

export const getUserById = async (id: number) => {
    return await prisma.user.findUnique({
        where: { id },
        select: { id: true, username: true, xp: true, level: true },
    });
};
