import { Inject, InternalServerErrorException } from '@nestjs/common';
import { Permission } from '../entity/permissions.entity';

export class PermissonRepo {
  constructor(
    @Inject('PERMISSION_REPOSITORY') private Repository: typeof Permission,
  ) {}
  async showAllPermissions() {
    try {
      return this.Repository.findAll({
        attributes: ['userId', 'action'],
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
  async addPermission(permit: Partial<Permission>) {
    try {
      const user = await this.isPermissionExists(permit);
      if (!user) return await this.Repository.create(permit);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async isPermissionExists(permit: Partial<Permission>) {
    try {
      const user = await this.Repository.findOne({
        where: { userId: permit.userId, action: permit.action },
      });
      if (user) {
        return user;
      } else {
        return false;
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
  // new function return all permissions with given user
  async permissionTOUser(userId: string) {
    try {
      const permissions = await this.Repository.findAll({
        where: { userId: userId },
        raw: true,
        attributes: ['action'],
      });
      return permissions;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
