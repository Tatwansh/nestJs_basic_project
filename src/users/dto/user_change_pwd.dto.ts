import { IsString, IsStrongPassword } from 'class-validator';

export class UserChangePwdDto {
  @IsString()
  random_access_token: string;
  @IsStrongPassword()
  new_password: string;
  @IsStrongPassword()
  confirm_password: string;
}
