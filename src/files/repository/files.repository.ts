import { Inject } from '@nestjs/common';
import { File } from '../model/files.entity';

export class FileRepo {
  constructor(@Inject('FILE_REPOSITORY') private Repository: typeof File) {}
  async findall() {
    return this.Repository.findAll();
  }

  async findByUser(userId: string) {
    return this.Repository.findAll({
      where: { userId },
    });
  }
  async uploadFile(data: Partial<File>) {
    return await this.Repository.create(data);
  }

  async uploadFiles(data: Partial<File>[]) {
    return await this.Repository.bulkCreate(data);
  }
}
