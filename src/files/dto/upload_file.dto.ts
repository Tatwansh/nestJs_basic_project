import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class FileUploadDTO {
  @Expose()
  @IsString()
  filename: string;

  @Expose()
  @IsString()
  filetype: string;
}
