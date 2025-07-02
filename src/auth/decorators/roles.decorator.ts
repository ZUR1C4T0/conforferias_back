import { SetMetadata } from '@nestjs/common'
import { UserRole } from '@prisma/client'

export function Roles(...roles: UserRole[]) {
  return SetMetadata('roles', roles)
}
