import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
    constructor(
        private readonly jwtService: JwtService,
    ) { }


    async generateToken(user: IUser & { from?: string, old_password?: string }): Promise<string> {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not set');
        }
        try {
            const token = this.jwtService.sign({
                userId: user._id?.toString(),
                email: user.email,
            }, {
                secret: process.env.JWT_SECRET,
                expiresIn: '1w'
            });
            return token;
        } catch (error) {
            console.error('--- libs/crypto/crypto.service.ts: generateToken() error: ', error);
            throw error;
        }
    }

    async password_hash(password: string): Promise<string | null> {
        try {
            const salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT_ROUNDS || 10);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (error) {
            console.error('--- libs/crypto/crypto.service.ts: password_hash() error: ', error);
            throw error;
        }
    }

    async password_compare(password: string, hash: string): Promise<boolean | null> {
        try {
            const result = await bcrypt.compare(password, hash);
            return result;
        } catch (error) {
            throw console.error('--- libs/crypto/crypto.service.ts: password_compare() error: ', error);
        }
    }

}
