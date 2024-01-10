import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, IsOptional, IsString, MinLength, IsEnum } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({
        required: false
    })
    @IsEmail()
    @IsString()
    @MinLength(1)
    @IsOptional()
    email?: string;

    @ApiProperty({
        required: false,
        enum: [
            'user',
            'admin',
        ],
        description: 'Only admin able to set roles'
    })
    @IsEnum(['user', 'admin'])
    @IsString()
    @IsOptional()
    role?: string;

}
