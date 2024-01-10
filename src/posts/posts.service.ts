
import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ObjectId, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';
import { IPost, Post } from './entities/post.entity';
import { IUser } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly currentModel: Model<IPost>
  ) { }

  async getAll(query: FilterQuery<IPost>, projection: ProjectionType<IPost> = {}, options: QueryOptions<IPost> = {}) {
    return this.currentModel.find(query, projection, options);
  }

  async getOne(query: FilterQuery<IPost>, projection: ProjectionType<IPost> = {}, options: QueryOptions<IPost> = {}) {
    return this.currentModel.findOne(query, projection, options);
  }

  async getById(id: string | ObjectId, projection: ProjectionType<IPost> = {}, options: QueryOptions<IPost> = {}) {
    return this.currentModel.findById(id, projection, options);
  }

  async create(data: IPost, user: IUser) {
    data.user = user;
    return this.currentModel.create(data);
  }

  async update(id: string, data: UpdateQuery<IPost>, projection: ProjectionType<IPost> = {}, options: QueryOptions<IPost> = {}, user: IUser = null) {
    const candidate = await this.getById(id, { user: 1 });
    if (user && candidate && user._id?.toString() !== candidate.user?.toString() && user?.role !== 'admin') throw new HttpException('You are not able to update this post', 401);

    return this.currentModel.findByIdAndUpdate(id, data, { new: true, projection, ...options });
  }

  async delete(id: string, user: IUser = null) {
    const candidate = await this.getById(id, { user: 1 });
    if (user && candidate && user._id?.toString() !== candidate.user?.toString() && user?.role !== 'admin') throw new HttpException('You are not able to delete this post', 401);
    return this.currentModel.findByIdAndDelete(id);
  }
}
