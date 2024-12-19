export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    xp: number;
    level: number;
    createdAt: Date;
    updatedAt: Date;
}

export type PublicUser = Omit<User, 'password'>;

export type CreateUserDTO = Omit<User, 'id' | 'xp' | 'level' | 'createdAt' | 'updatedAt'>;

export type UpdateUserDTO = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;