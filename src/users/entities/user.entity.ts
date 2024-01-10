import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

export type IUser = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({
        required: true,
        index: true,
    })
    @ApiProperty({
        required: true
    })
    email: string;

    @Prop({
        required: true
    })
    @ApiProperty({
        required: true
    })
    password: string;

    @Prop({
        required: false,
        enum: [
            'user',
            'admin'
        ],
        default: 'user',
        index: true,
    })
    @ApiProperty({
        required: false,
        enum: [
            'user',
            'admin'
        ],
        default: 'user',
    })
    role?: string;

    @Prop({
        required: false,
        default: Date.now
    })
    @ApiProperty({
        required: false,
        default: 'current timestamp'
    })
    date_updated?: number;

    @Prop({
        required: false,
        default: Date.now,
        index: true,
    })
    @ApiProperty({
        required: false,
        default: 'current timestamp'
    })
    date_created?: number;
}

export const UserSchema = SchemaFactory.createForClass(User)
    .pre('updateOne', function (next) {
        this.set({
            date_updated: Date.now()
        });

        next();
    });
