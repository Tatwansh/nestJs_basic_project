import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [DatabaseModule, UsersModule, PermissionsModule],
  providers: [],
})
export class AppModule {}
