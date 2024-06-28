import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { MIN_PASSWORD_LENGTH } from '@environments';
import { characterLimitMessage, characterValidationMessage } from './login.dto';

export class RegisterDto {
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH, {
    message: characterLimitMessage,
  })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/, {
    message: characterValidationMessage,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}
