import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser, User } from './entities/user.entity';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthRoles } from 'src/auth/roles.decorator';
import { GetUser } from './users.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('/all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users', type: User, isArray: true })
  @AuthRoles()
  async getAll(@Res() res: Response, @Query() query: any, @GetUser() user: IUser) {
    try {
      const result = await this.usersService.getAll(query, { email: 1, role: 1 }, { ...query });
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || error.statusCode || 500, { cause: error });
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'Return user', type: User })
  @ApiParam({ name: 'id', required: true, description: 'User\'s id' })
  @AuthRoles()
  async getById(@Res() res: Response, @Param('id') id: string, @GetUser() user: IUser) {
    try {
      const result = await this.usersService.getById(id, { email: 1, role: 1 });
      if (!result) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, { cause: error });
    }
  }


  @Patch('/:id')
  @ApiOperation({ summary: 'Update user', description: 'Only current user able to update himself or admin' })
  @ApiResponse({ status: 200, description: 'Return updated user', type: User })
  @ApiParam({ name: 'id', required: true, description: 'User\'s id' })
  @ApiBody({ type: UpdateUserDto })
  @AuthRoles()
  async update(@Res() res: Response, @Param('id') id: string, @Body() body: UpdateUserDto, @GetUser() user: IUser) {
    try {
      const result = await this.usersService.update(id, body, {}, {}, user);
      if (!result) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, { cause: error });
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete user', description: 'Only current user able to delete himself or admin' })
  @ApiResponse({ status: 200, description: 'Return deleted user', type: User })
  @ApiParam({ name: 'id', required: true, description: 'User\'s id' })
  @AuthRoles()
  async delete(@Res() res: Response, @Param('id') id: string, @GetUser() user: IUser) {
    try {
      const result = await this.usersService.delete(id, user);
      if (!result) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, { cause: error });
    }
  }
}
