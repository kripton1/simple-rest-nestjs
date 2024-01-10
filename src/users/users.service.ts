import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, User } from './entities/user.entity';
import { FilterQuery, Model, ObjectId, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly currentModel: Model<IUser>
  ) { }

  async getAll(query: FilterQuery<IUser>, projection: ProjectionType<IUser> = {}, options: QueryOptions<IUser> = {}) {
    return this.currentModel.find(query, projection, options);
  }

  async getOne(query: FilterQuery<IUser>, projection: ProjectionType<IUser> = {}, options: QueryOptions<IUser> = {}) {
    return this.currentModel.findOne(query, projection, options);
  }

  async getById(id: string | ObjectId, projection: ProjectionType<IUser> = {}, options: QueryOptions<IUser> = {}) {
    return this.currentModel.findById(id, projection, options);
  }

  async create(data: CreateUserDto) {
    return this.currentModel.create(data);
  }

  async update(id: string, data: UpdateQuery<IUser>, projection: ProjectionType<IUser> = {}, options: QueryOptions<IUser> = {}, user: IUser = null) {
    if (user && user._id?.toString() !== id && user?.role !== 'admin') throw new HttpException('You are not able to update this user', 401);
    if (user?.role !== 'admin') delete data.role;

    return this.currentModel.findByIdAndUpdate(id, data, { new: true, projection, ...options });
  }

  async delete(id: string, user: IUser = null) {
    if (user && user._id?.toString() !== id && user?.role !== 'admin') throw new HttpException('You are not able to delete this user', 401);
    return this.currentModel.findByIdAndDelete(id);
  }
}
