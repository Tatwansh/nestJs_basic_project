import { Module } from '@nestjs/common';
import { PermissonProviders } from './repository/permissions.provider';
import { PermissonRepo } from './repository/permissions.repository';
import { PermissionsService } from './service/permissions.service';
import { PermissionsController } from './permissions.controller';

@Module({
  controllers: [PermissionsController],
  providers: [...PermissonProviders, PermissonRepo, PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
