import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreatePostDto {
    @ApiProperty({
        required: true
    })
    @IsString()
    @MinLength(6)
    subject: string;

    @ApiProperty({
        required: true
    })
    @IsString()
    @MinLength(20)
    description: string;

}
