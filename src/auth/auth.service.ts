import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

export interface IJwtPayload {
    userId: string;
    email: string;
}

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersSerivce: UsersService,
    ) { }

    decodeToken(token: string): IJwtPayload | null | void {
        try {
            const decoded = this.jwtService.verify(token);
            return decoded;
        } catch (error) {
            console.error('--- auth/auth.service.ts: decodeToken() error: ', error);
            return null;
        }
    }

    async validateUser(payload: IJwtPayload): Promise<IUser & { jwt?: any } | null | void> {
        try {
            const user = await this.usersSerivce.getById(payload.userId, {
                _id: 1,
                email: 1,
                role: 1,
            });
            if (!user) return null;
            return user;
        } catch (error) {
            return console.error('--- auth/auth.service.ts: validateUser() error: ', error);
        }
    }

}
