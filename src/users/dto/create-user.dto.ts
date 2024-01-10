import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        required: true,
    })
    @IsEmail()
    @IsString()
    @MinLength(1)
    email: string;

    @ApiProperty({
        required: true
    })
    @IsStrongPassword({
        minLength: 4,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 0,
    })
    @IsString()
    password: string;
}
