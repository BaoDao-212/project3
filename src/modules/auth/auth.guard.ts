import { User } from './../../entities/user.entity';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { verify } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { AllowedRole } from './role.decorator';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const roles = this.reflector.get<AllowedRole[]>(
        'roles',
        context.getHandler(),
      );
      if (!roles) return true;
      const request = context.switchToHttp().getRequest();

      const accessToken = request.headers['authorization'];
      const decoded = verify(
        accessToken,
        this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      );
      if (!decoded || !decoded['userId']) return false;
      const user = await this.userRepo.findOne({
        where: { id: +decoded['userId'] },
      });
      if (!user || (!roles.includes(user.position) && !roles.includes('Any')))
        return false;
      request.user = user;
      return true;
    } catch {
      return false;
    }
  }
}
