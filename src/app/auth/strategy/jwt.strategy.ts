import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from '@environments';
import { IPayload } from '../interface';
import { ERROR_CODES } from '@errors';
import { Request } from 'express';
import { AccountEntity } from '../entity/account.entity';
import { AccountService } from 'src/app/account/account.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly accountService: AccountService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IPayload): Promise<AccountEntity> {
    const accessToken = await req.headers.authorization.substring(7);
    const user = await this.accountService.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedException(
        'You are unauthorized to access',
        ERROR_CODES.UNAUTHORIZED,
      );
    }
    return user;
  }
}
