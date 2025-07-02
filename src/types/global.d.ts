// biome-ignore lint/style/noNamespace: Allow extending Express namespace
declare namespace Express {
  interface User {
    id: string
    role: string
    token: string
  }
}

declare interface JwtPayload {
  sub: string
  role: string
}
