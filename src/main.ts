import { ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { AuthGuard } from './auth/guards/auth.guard'
import { RolesGuard } from './auth/guards/roles.guard'

async function bootstrap() {
  // --- 🚀 NESTJS APPLICATION ---
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },
  })

  // --- 🛡️ SECURITY MIDDLEWARES ---
  app.use(helmet())

  // --- 📦 MIDDLEWARES ---
  const reflector = app.get(Reflector)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalGuards(new AuthGuard(reflector), new RolesGuard(reflector))

  await app.listen(process.env.PORT ?? 4000)
}
bootstrap()
