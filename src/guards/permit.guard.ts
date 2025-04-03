import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { permissionTypes } from 'src/constants/permission/permission_types.constant';
import { PERMISSION_KEY } from 'src/decorators/permission.decorator';
import { PermissionsService } from 'src/permissions/service/permissions.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredPermission =
        this.reflector.getAllAndOverride<permissionTypes>(PERMISSION_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
      const req = context.switchToHttp().getRequest();
      const permissions = await this.permissionService.permissionsToUser(
        req.user.sub.id,
      );

      //const permissions = req.user.sub.permissions; // object datatype
      return permissions.includes(requiredPermission);
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
