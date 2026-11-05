import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2'; 
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
         private readonly jwtService: JwtService,
    ){}

async validateUser(login: string, password: string) {
  const user = await this.usersService.findByLogin(login) 
  if (!user || !user.isActive) {
  throw new UnauthorizedException('Неверный логин или пароль');
}
const isPasswordValid = await verify(user.passwordHash, password);
if (!isPasswordValid) throw new UnauthorizedException('Неверный логин или пароль');
const { passwordHash, ...safeUser } = user;
return safeUser;
}

async login(login: string, password: string) {
  const user = await this.validateUser(login, password);
  const payload = {
  sub: user.id,
  role: user.role,
};
return {
  access_token: await this.jwtService.signAsync(payload),
};
}

}

