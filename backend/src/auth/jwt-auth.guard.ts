import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: { id: number; login: string; role: string };
    }>();

    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Токен не предоставлен');
    }

    let payload: { sub: unknown };

    try {
      payload = await this.jwtService.verifyAsync<{ sub: unknown }>(token);
    } catch {
      throw new UnauthorizedException('Недействительный или просроченный токен');
    }

    if (
      typeof payload.sub !== 'number' ||
      !Number.isInteger(payload.sub) ||
      payload.sub < 1
    ) {
      throw new UnauthorizedException('Некорректный токен');
    }

    const user = await this.usersService.findOne(payload.sub).catch(
      (error: unknown) => {
        if (error instanceof NotFoundException) {
          return null;
        }
        throw error;
      },
    );

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Пользователь неактивен или не найден');
    }

    request.user = {
      id: user.id,
      login: user.login,
      role: user.role,
    };

    return true;
  }
}