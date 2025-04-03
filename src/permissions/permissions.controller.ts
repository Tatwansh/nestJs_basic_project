import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PermissionsService } from './service/permissions.service';
import { SetMessage } from 'src/decorators/custom_response.decorator';
import { PermitSetupDTO } from './dto/permisssion_request.dto';

@Controller('/permissions')
export class PermissionsController {
  constructor(private service: PermissionsService) {}

  @Post()
  @SetMessage('Permisssion granted successfully! ')
  async grantPermission(@Body() permit: PermitSetupDTO) {
    return this.service.grantPermission(permit);
  }
  @Get()
  async showAllPermissions() {
    return this.service.showPermissions();
  }
  @Get(':id')
  async showUserPermission(@Param('id') id: string) {
    return this.service.permissionsToUser(id);
  }
}
