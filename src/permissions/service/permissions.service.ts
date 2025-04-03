import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PermissonRepo } from '../repository/permissions.repository';
import { PermitSetupDTO } from '../dto/permisssion_request.dto';

@Injectable()
export class PermissionsService {
  constructor(private repo: PermissonRepo) {}

  // Grants a new permission by adding it to the repository
  async grantPermission(permit: PermitSetupDTO) {
    return await this.repo.addPermission(permit);
  }

  // Retrieves all permissions from the repository
  async showPermissions() {
    return this.repo.showAllPermissions();
  }

  // Checks if a user has 'edit' permission
  async checkEdit(id: string) {
    return (await this.repo.isPermissionExists({ userId: id, action: 'edit' }))
      ? true
      : false;
  }

  // Checks if a user has 'delete' permission
  async checkDelete(id: string) {
    return (await this.repo.isPermissionExists({
      userId: id,
      action: 'delete',
    }))
      ? true
      : false;
  }

  // Retrieves all permissions assigned to a specific user
  async permissionsToUser(userId: string) {
    try {
      const permissions = await this.repo.permissionTOUser(userId);

      // Logs a message if no permissions are found for the user
      if (!permissions || !permissions.length) {
        console.log('no permissions set for given user');
      }

      // Maps the permissions to extract the 'action' field
      const perm = permissions.map((permissions) => permissions.action);
      return perm;
    } catch (err) {
      // Throws an UnauthorizedException if an error occurs
      throw new UnauthorizedException(err);
    }
  }
}
