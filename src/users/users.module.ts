import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { UserProviders } from './repository/users.providers';
import { UserRepo } from './repository/users.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { FilesModule } from 'src/files/files.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FilesModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Ensure JWT_SECRET is set
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        dest: config.get<string>('DESTINATION'),
        limits: {
          fileSize: 1024 * 1024 * 2, // MaxSize: 2 MB
        },
      }),
      inject: [ConfigService],
    }),
    PermissionsModule,
  ],
  controllers: [UsersController],
  providers: [
    AuthService,
    UsersService,
    ...UserProviders,
    UserRepo,
    ConfigService,
  ],
  exports: [UsersService, AuthService, JwtModule],
})
export class UsersModule {}
