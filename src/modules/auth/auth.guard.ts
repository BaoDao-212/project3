import { User } from './../../entities/user.entity';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { verify } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { AllowedRole } from './role.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
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
      const googleAuthClient = new OAuth2Client({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_CALLBACK_URL,
      });
      const accessToken = request.headers['authorization'];

      try {
        const ticket = await googleAuthClient.verifyIdToken({
          idToken: accessToken,
          audience: process.env.CLIENT_ID,
        });

        const info = ticket.getPayload();
        const userEmail = await this.userRepo.findOne({
          where: { email: info.email },
        });
        const { email, name, picture } = info;
        if (!userEmail) {
          const userH = await this.userRepo.create({
            username: name,
            name,
            password: '',
            email,
          });
          await this.userRepo.save(userH);
        }
        const user = await this.userRepo.findOne({
          where: { email: info.email },
        });
        request.user = user;
        return true;
      } catch (error) {
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
      }
      // if (ticket.getPayload().email_verified) {
      //   const userEmail = await this.userRepo.findOne({
      //     where: { email: ticket.getPayload().email },
      //   });
      //   const info = ticket.getPayload();
      //   if (!userEmail) {
      //     this.userRepo.save(
      //       this.userRepo.create({
      //         username: info.name,
      //         name: info.name,
      //         email: info.email,
      //         password: '',
      //       }),
      //     );
      //   }
      //   const user = await this.userRepo.findOne({
      //     where: { email: ticket.getPayload().email },
      //   });
      //   request.user = user;
      //   return true;
      // } else {
      //   const decoded = verify(
      //     accessToken,
      //     this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      //   );
      //   if (!decoded || !decoded['userId']) return false;
      //   const user = await this.userRepo.findOne({
      //     where: { id: +decoded['userId'] },
      //   });
      //   if (!user || (!roles.includes(user.position) && !roles.includes('Any')))
      //     return false;
      //   request.user = user;
      //   return true;
      // }
    } catch {
      return false;
    }
  }
}
