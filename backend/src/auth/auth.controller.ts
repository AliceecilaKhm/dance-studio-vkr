import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Get, Req } from '@nestjs/common';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.login, loginDto.password);
  }

  @Get('me')
me(
  @Req()
  request: {
    user?: { id: number; login: string; role: string };
  },
) {
  return request.user;
}
}
