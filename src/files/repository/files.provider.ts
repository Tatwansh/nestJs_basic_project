import { File } from '../model/files.entity';

export const FileProviders = [
  {
    provide: 'FILE_REPOSITORY',
    useValue: File,
  },
];
