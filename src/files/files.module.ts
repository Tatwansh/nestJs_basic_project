import { Module } from '@nestjs/common';
import { FileService } from './files.service';
import { FileProviders } from './repository/files.provider';
import { FileRepo } from './repository/files.repository';

@Module({
  providers: [...FileProviders, FileService, FileRepo],
  exports: [FileService],
})
export class FilesModule {}
