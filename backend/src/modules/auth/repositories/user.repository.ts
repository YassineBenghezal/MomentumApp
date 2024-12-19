import prisma from '../../../config/prisma.client';

export class UserRepository {
    async findByUsername(username: string) {
        return await prisma.user.findUnique({ where: { username } });
    }

    async createUser(username: string, hashedPassword: string) {
        return await prisma.user.create({
            data: { username, password: hashedPassword },
        });
    }
}
