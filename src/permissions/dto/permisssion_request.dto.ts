import { IsEnum, IsString } from 'class-validator';
import { permissionTypes } from 'src/constants/permission/permission_types.constant';

export class PermitSetupDTO {
  @IsString()
  userId: string;

  @IsString()
  @IsEnum(permissionTypes, { always: true })
  action: string;
}
