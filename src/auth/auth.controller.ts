import { Body, Controller, Get, HttpException, Post, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBody, ApiBearerAuth, ApiUnauthorizedResponse, ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './auth.guard';
import { Prop } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { AuthLoginBodyDto } from './dto/auth-login-body.dto';
import { CryptoService } from '@app/crypto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { IUser, User } from 'src/users/entities/user.entity';
import { AuthRoles } from './roles.decorator';
import { AuthCheckEmailBodyDto } from './dto/auth-check-email-body.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly cryptoService: CryptoService,
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: AuthLoginBodyDto })
    @ApiResponse({ status: 200, description: 'Return user and token' })
    async login(@Res() res: Response, @Body() body: AuthLoginBodyDto) {
        try {
            body.email = body?.email?.trim()?.toLowerCase();
            const user = await this.usersService.getOne({
                email: body.email,
            });
            if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
            if (!user.password) return res.status(403).json({ status: 'error', message: 'Wrong password' });

            const passwordMatch = await this.cryptoService.password_compare(body.password, user.password)
            if (!passwordMatch) return res.status(403).json({ status: 'error', message: 'Wrong password' });
            delete user.password;
            const token = await this.cryptoService.generateToken(user);
            return res.status(200).json({ status: 'ok', token, user });
        } catch (error) {
            throw new HttpException(error.message, error.status || 500, { cause: error });
        }
    }

    @Post('register')
    @ApiOperation({ summary: 'Register' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 200, description: 'Return user and token' })
    async register(@Res() res: Response, @Body() body: CreateUserDto) {
        try {
            const data = body;

            if (body?.email) {
                data.email = body?.email?.trim()?.toLowerCase();
                const emailUser = await this.usersService.getOne({
                    email: data.email,
                });
                if (emailUser) return res.status(403).json({ status: 'error', message: 'Email already in use' });
            }

            data.password = await this.cryptoService.password_hash(body.password);

            const user = await this.usersService.create(data);
            const token = await this.cryptoService.generateToken(user);
            return res.status(200).json({ status: 'ok', token, user });
        } catch (error) {
            throw new HttpException(error.message, error.status || 500, { cause: error });
        }
    }

    @Post('validate')
    @ApiOperation({ summary: 'Validate token' })
    @ApiResponse({ status: 200, description: 'Return user', type: User })
    @AuthRoles()
    async validate(@Res() res: Response, @Req() req: Request & { user: IUser }) {
        try {
            const user = await this.usersService.getById(req.user.id, { email: 1 });
            return res.status(200).json({ status: 'ok', user });
        } catch (error) {
            throw new HttpException(error.message, error.status || 500, { cause: error });
        }
    }

    @Post('email')
    @ApiOperation({ summary: 'Check if email is already in use' })
    @ApiBody({ type: AuthCheckEmailBodyDto })
    @ApiResponse({ status: 200, description: 'Return true if email is already in use' })
    async email(@Res() res: Response, @Body() body: AuthCheckEmailBodyDto) {
        try {
            body.email = body?.email?.trim()?.toLowerCase();
            const user = await this.usersService.getOne({ email: body.email }, { email: 1 });
            return res.status(200).json({ status: 'ok', used: !!user });
        } catch (error) {
            throw new HttpException(error.message, error.status || 500, { cause: error });
        }
    }

}
