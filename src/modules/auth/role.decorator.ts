import { SetMetadata } from '@nestjs/common';
import { Position } from 'src/entities/user.entity';

export type AllowedRole = keyof typeof Position | 'Any';
export function Roles(roles: AllowedRole[]) {
  return SetMetadata('roles', roles);
}
