import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class AuthCheckEmailBodyDto {

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  @IsString()
  @MinLength(1)
  email: string;

}
