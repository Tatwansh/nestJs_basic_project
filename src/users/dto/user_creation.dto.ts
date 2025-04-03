import {
  IsAlpha,
  IsEmail,
  IsNumber,
  IsString,
  IsStrongPassword,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class UserCreateDto {
  @IsString()
  @IsAlpha()
  readonly name: string;

  @IsStrongPassword()
  password: string;

  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  readonly email: string;

  @Min(1000000000)
  @Max(9999999999)
  @IsNumber()
  readonly phone: number;
}
