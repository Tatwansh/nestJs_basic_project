import { Permission } from '../entity/permissions.entity';

export const PermissonProviders = [
  { provide: 'PERMISSION_REPOSITORY', useValue: Permission },
];
