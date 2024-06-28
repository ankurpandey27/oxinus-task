import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signIn(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('/signup')
  async signUp(@Body() data: RegisterDto) {
    return await this.authService.signUp(data);
  }
}
