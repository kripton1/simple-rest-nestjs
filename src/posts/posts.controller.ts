
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpException, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthRoles } from 'src/auth/roles.decorator';
import { GetUser } from 'src/users/users.decorator';
import { IUser, User } from 'src/users/entities/user.entity';
import { IPost, Post as PostEntity } from './entities/post.entity';
import { PopulateOptions } from 'mongoose';


@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  private population: PopulateOptions[] = [
    {
      path: 'user',
      model: User.name,
      select: [
        'email',
        'role'
      ]
    }
  ];

  constructor(private readonly postsService: PostsService) { }

  @Get('/all')
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts', type: Post, isArray: true })
  @AuthRoles()
  async getAll(@Res() res: Response, @Query() query: any, @GetUser() user: IUser) {
    try {
      const result = await this.postsService.getAll(query, {}, { ...query, populate: this.population });
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || error.statusCode || 500, { cause: error });
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get post by id' })
  @ApiResponse({ status: 200, description: 'Return post', type: PostEntity })
  @ApiParam({ name: 'id', required: true, description: 'Post\'s id' })
  @AuthRoles()
  async getById(@Res() res: Response, @Param('id') id: string, @GetUser() user: IUser) {
    try {
      const result = await this.postsService.getById(id, {}, { populate: this.population });
      if (!result) return res.status(404).json({ message: 'Post not found' });
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, { cause: error });
    }
  }

  @Post('/')
  @ApiOperation({ summary: 'Create new post' })
  @ApiResponse({ status: 201, description: 'Return created post', type: PostEntity })
  @ApiBody({ type: CreatePostDto })
  @AuthRoles()
  async create(@Res() res: Response, @Body() body: CreatePostDto, @GetUser() user: IUser) {
    try {
      const result = await this.postsService.create(body as IPost, user);
      return res.status(201).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || error.statusCode || 500, { cause: error });
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update post', description: 'Only user who created post able to update it or admin' })
  @ApiResponse({ status: 200, description: 'Return updated post', type: PostEntity })
  @ApiParam({ name: 'id', required: true, description: 'Post\'s id' })
  @ApiBody({ type: UpdatePostDto })
  @AuthRoles()
  async update(@Res() res: Response, @Param('id') id: string, @Body() body: UpdatePostDto, @GetUser() user: IUser) {
    try {
      const result = await this.postsService.update(id, body, {}, {}, user);
      if (!result) return res.status(404).json({ message: 'Post not found' });
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, { cause: error });
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete post', description: 'Only user who created post able to delete it or admin' })
  @ApiResponse({ status: 200, description: 'Return deleted post', type: PostEntity })
  @ApiParam({ name: 'id', required: true, description: 'Post\'s id' })
  @AuthRoles()
  async delete(@Res() res: Response, @Param('id') id: string, @GetUser() user: IUser) {
    try {
      const result = await this.postsService.delete(id, user);
      if (!result) return res.status(404).json({ message: 'Post not found' });
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, { cause: error });
    }
  }
}
