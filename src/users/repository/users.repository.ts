import {
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entity/users.entity';
import { UserCreateDto } from '../dto/user_creation.dto';
import { Permission } from 'src/permissions/entity/permissions.entity';

export class UserRepo {
  constructor(@Inject('USER_REPOSITORY') private UserRepository: typeof User) {}
  async findAll() {
    try {
      const users: User[] = await this.UserRepository.findAll();
      return users;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findOneId(id: string) {
    try {
      const user = await this.UserRepository.findOne({ where: { id } });
      return user;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findOneByEmail(e_mail: string) {
    try {
      return this.UserRepository.findOne({ where: { email: e_mail } });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async create(user: UserCreateDto): Promise<User | null> {
    try {
      return await this.UserRepository.create<User>({ ...user });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async update(id: string, user: Partial<User>) {
    try {
      const elements = await this.UserRepository.update(user, {
        where: { id },
      });
      const rows = elements[0];
      return `${rows} rows were affected`;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async remove(id: string) {
    try {
      const rows = await this.UserRepository.destroy({ where: { id } });
      return `${rows} rows were deleted`;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findByToken(random_access_token: string) {
    try {
      const user = await this.UserRepository.findOne({
        where: { random_access_token },
      });
      return user;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findPermissionToUser(id: string) {
    try {
      const user = await this.UserRepository.findAll({
        include: [
          { model: Permission, required: true, attributes: ['action'] },
        ],
        raw: true,
        where: { id },
      });
      return user;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
