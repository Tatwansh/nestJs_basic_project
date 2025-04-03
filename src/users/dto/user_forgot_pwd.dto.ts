import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class UserForgotPwdDto {
  @IsEmail()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  email: string;
}
