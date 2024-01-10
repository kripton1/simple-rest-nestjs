import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { IUser, User } from "src/users/entities/user.entity";

export type IPost = HydratedDocument<Post>;

@Schema()
export class Post {
    @Prop({
        type: SchemaTypes.ObjectId,
        required: true,
        index: true,
    })
    @ApiProperty({
        type: User,
        required: true
    })
    user: IUser;

    @Prop({
        required: true,
        index: true,
    })
    @ApiProperty({
        required: true
    })
    subject: string;

    @Prop({
        required: true,
        index: true,
    })
    @ApiProperty({
        required: true
    })
    description: string;

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

export const PostSchema = SchemaFactory.createForClass(Post)
    .pre('updateOne', function (next) {
        this.set({
            date_updated: Date.now()
        });

        next();
    });
