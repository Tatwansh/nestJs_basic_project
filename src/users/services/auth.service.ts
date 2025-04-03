import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepo } from '../repository/users.repository';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { UserCreateDto } from '../dto/user_creation.dto';
import { User } from '../entity/users.entity';
import { UserLoginDto } from '../dto/user_login.dto';
import { UserForgotPwdDto } from '../dto/user_forgot_pwd.dto';
import { UserChangePwdDto } from '../dto/user_change_pwd.dto';
import { JwtService } from '@nestjs/jwt';
import { PermissionsService } from 'src/permissions/service/permissions.service';

const crypt = promisify(scrypt);
@Injectable()
export class AuthService {
  constructor(
    private repo: UserRepo,
    private jwtService: JwtService,
    private permissionService: PermissionsService,
  ) {}

  // Method to register a new user
  async signup(user: UserCreateDto) {
    try {
      // Check if the user already exists
      const userExists = await this.repo.findOneByEmail(user.email);
      if (userExists) {
        throw new HttpException(
          'User already exists with given email. Please try again with a different email-id.',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        // Generate a hashed password with a salt
        const salt = randomBytes(8).toString('hex');
        const hash = (await crypt(user.password, salt, 32)) as Buffer;

        user.password = `${hash.toString('hex')}.${salt}`;

        // Save the new user to the database
        const user_created = await this.repo.create(user);
        if (user_created) {
          return user_created;
        }
      }
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }

  // Method to authenticate a user during login
  async signin(user: UserLoginDto) {
    // Check if the user exists in the database
    const userExists: User | null = await this.repo.findOneByEmail(user.email);
    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      // Validate the provided password
      const [hash, salt] = userExists.password.split('.');
      const hash_compare = (await crypt(user.password, salt, 32)) as Buffer;

      if (hash === hash_compare.toString('hex')) {
        // Fetch user permissions and generate a JWT token
        const permissions = await this.permissionService.permissionsToUser(
          userExists.id,
        );
        const subject = { id: userExists.id, permissions };
        const payload = { sub: subject, username: userExists.name };
        const access_token = await this.jwtService.signAsync(payload);
        return access_token;
      } else {
        throw new HttpException(
          'User is not logged in as wrong password is entered',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }

  // Method to change the user's password
  async changePassword(user: UserChangePwdDto) {
    try {
      // Verify the token and fetch the user
      const targetUser = await this.repo.findByToken(user.random_access_token);
      if (!targetUser) {
        throw new HttpException('Wrong Token Entered', HttpStatus.NOT_FOUND);
      } else {
        // Ensure the new password and confirmation match
        if (user.new_password !== user.confirm_password) {
          throw new HttpException(
            "Passwords don't match",
            HttpStatus.BAD_REQUEST,
          );
        }
        // Hash the new password and update the user record
        const salt = randomBytes(8).toString('hex');
        const hash = (await crypt(user.new_password, salt, 32)) as Buffer;
        user['password'] = `${hash.toString('hex')}.${salt}`;
        user.random_access_token = '';
        await this.repo.update(targetUser.id, user);
        return { Success: 'Password is updated' };
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  // Method to request a password reset token
  async requestPwdChange(body: UserForgotPwdDto) {
    const targetUser = await this.repo.findOneByEmail(body.email);
    if (targetUser) {
      // Generate a random token and save it to the user record
      const token = randomBytes(10).toString('hex');
      await this.repo.update(targetUser.id, { random_access_token: token });
      return { Success: 'Token Generated Successfully' };
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
