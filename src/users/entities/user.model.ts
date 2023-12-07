import { Column, DataType, Default, DefaultScope, Index, IsUUID, Model, PrimaryKey, Scopes, Table, Unique } from "sequelize-typescript";

@DefaultScope(() => ({
    attributes: ['id', 'first_name', 'last_name', 'date_created']
}))
@Table
export class User extends Model {
    @IsUUID(4)
    @PrimaryKey
    @Unique
    @Index
    @Column
    id: string;

    @Index('full-name')
    @Column
    first_name: string;

    @Index('full-name')
    @Column
    last_name: string;

    @Index
    @Column
    email: string;

    @Column
    password: string;

    @Index
    @Default('user')
    @Column
    role: string;
}
