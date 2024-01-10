import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdatePostDto {
    @ApiProperty({
        required: false
    })
    @IsString()
    @MinLength(6)
    @IsOptional()
    subject: string;

    @ApiProperty({
        required: false
    })
    @IsString()
    @MinLength(20)
    @IsOptional()
    description: string;

}
