import { SetMetadata } from '@nestjs/common';
import { permissionTypes } from 'src/constants/permission/permission_types.constant';

export const PERMISSION_KEY = 'Permission Required';
export const RequiredPermission = (permit: permissionTypes) =>
  SetMetadata(PERMISSION_KEY, permit);
