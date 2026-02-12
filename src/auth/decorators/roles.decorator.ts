import { UserRole } from '@generated/prisma/client'
import { SetMetadata } from '@nestjs/common'

export function Roles(...roles: UserRole[]) {
  return SetMetadata('roles', roles)
}
