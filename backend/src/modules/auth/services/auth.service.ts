import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcryptjs';

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async signup(username: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.userRepository.createUser(username, hashedPassword);
    }

    async validateUser(username: string, password: string) {
        const user = await this.userRepository.findByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return null;
        }
        return user;
    }
}
