import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

export function Public() {
  return SetMetadata(IS_PUBLIC_KEY, true)
}
