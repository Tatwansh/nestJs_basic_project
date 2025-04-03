import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepo } from '../repository/users.repository';
import { UserUpdationDto } from '../dto/user_updation.dto';

@Injectable()
export class UsersService {
  constructor(private repo: UserRepo) {}

  // Fetch all users from the repository
  async findAll() {
    return await this.repo.findAll();
  }

  // Check if a user exists by their ID and fetch their permissions
  async isUserExists(id: string) {
    try {
      const user = await this.repo.findPermissionToUser(id);
      if (!user || typeof user == 'undefined') {
        throw new HttpException(
          'No user with given id exists',
          HttpStatus.NOT_FOUND,
        );
      } else {
        return user;
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  // Update user details by their ID
  async update(id: string, user: UserUpdationDto) {
    try {
      await this.isUserExists(id); // Ensure the user exists
      const msg = await this.repo.update(id, user);
      return { Success: msg };
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }

  // Remove a user by their ID
  async remove(id: string) {
    try {
      await this.isUserExists(id); // Ensure the user exists
      return await this.repo.remove(id);
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
