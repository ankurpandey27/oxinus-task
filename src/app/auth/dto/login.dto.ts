import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { MIN_PASSWORD_LENGTH } from '@environments';
import { Transform } from 'class-transformer';
import { ROLES } from '@constants';

export const characterLimitMessage = `Password length must be more then ${MIN_PASSWORD_LENGTH}`;
export const characterValidationMessage =
  'password must contain one uppercase, lowercase, number and symbol';

export class LoginDto {
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: ROLES[];
}
