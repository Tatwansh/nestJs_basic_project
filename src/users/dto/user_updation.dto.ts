import {
  IsEmail,
  IsNumber,
  IsString,
  Max,
  Min,
  Matches,
} from 'class-validator';

export class UserUpdationDto {
  @IsString()
  readonly name?: string;

  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  readonly email?: string;

  @Min(1000000000)
  @Max(9999999999)
  @IsNumber()
  readonly phone?: number;
}
