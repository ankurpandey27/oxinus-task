import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthResponse } from './interface';
import { LoginDto, RegisterDto } from './dto';
import { compareHash, generateHash } from '../../core/utility';
import { ERROR_CODES } from '../../core/error-code';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from './entity/account.entity';
import * as admin from 'firebase-admin';
import { AccountService } from '../account/account.service';
import { firebaseAuth } from './firebase/firebase';

@Injectable()
export class AuthService {
  private auth: any;
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {
    this.auth = firebaseAuth;
  }

  async signUp(data: RegisterDto) {
    try {
      const { email, password } = data;
      const user = await admin.auth().getUserByEmail(email);

      if (user) {
        throw new BadRequestException(
          'This email address already exists',
          ERROR_CODES.EMAIL_ADDRESS_EXISTS,
        );
      }

      const hashPassword = await generateHash(password);

      const userRecord = await this.auth.createUser({
        email,
        password,
      });

      const newUser = this.accountRepository.create({
        firebase_user_id: userRecord.uid,
        email: data.email,
        password: hashPassword,
        role: data.role,
        is_active: true,
      });
      const userData = await this.accountRepository.save(newUser);

      const token = await this.auth.createCustomToken(user.uid);

      return {
        accessToken: token,
        data: {
          user_id: userData.id,
          role: userData.role,
        },
      };
    } catch (err) {
      Logger.log('error', err);
      throw err;
    }
  }

  async login(data: LoginDto): Promise<IAuthResponse | any> {
    try {
      const user: AccountEntity = await this.validateUser(
        data.email,
        data.password,
      );

      if (!user) {
        throw new UnauthorizedException(
          'You are not authorized to access',
          ERROR_CODES.UNAUTHORIZED,
        );
      }

      const token = await this.auth.createCustomToken(user.firebase_user_id);
      return {
        accessToken: token,
        data: {
          user_id: user.id,
          role: user.role,
        },
      };
    } catch (err) {
      Logger.log('error', err);
      throw err;
    }
  }

  async generatePayload(userId: string, role: string) {
    const accessToken = await this.jwtService.sign({
      userId,
      role,
    });
    return accessToken;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<AccountEntity | any> {
    const user = await admin.auth().getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(
        'Whoops, the login details you’ve entered are incorrect. Please try again.',
        ERROR_CODES.USER_NOT_FOUND,
      );
    }

    const localUser = await this.accountService.findByEmail(email);

    if (!localUser.password) {
      throw new BadRequestException('Whoops, please create your account');
    }

    const isPasswordValid = await compareHash(password, localUser.password);

    if (!isPasswordValid) {
      throw new BadRequestException(
        'Whoops, the password you’ve entered is incorrect. Please try again.',
        ERROR_CODES.INCORRECT_PASSWORD,
      );
    }
    return user ? user : null;
  }
}
