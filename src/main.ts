import { ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { AuthGuard } from './auth/guards/auth.guard'
import { RolesGuard } from './auth/guards/roles.guard'
import metadata from './metadata'

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

  // --- 📗 Documentación ---´
  const config = new DocumentBuilder()
    .setTitle('Conforferias API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  await SwaggerModule.loadPluginMetadata(metadata)
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('doc', app, documentFactory)

  await app.listen(process.env.PORT ?? 4000)
}
bootstrap()
