import { IsEmail, IsStrongPassword, Matches } from 'class-validator';

// Purpose: DTO for user login.
export class UserLoginDto {
  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  email: string;
  @IsStrongPassword()
  password: string;
}
