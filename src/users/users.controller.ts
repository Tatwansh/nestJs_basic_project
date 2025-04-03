import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { UserCreateDto } from './dto/user_creation.dto';
import { UserUpdationDto } from './dto/user_updation.dto';
import { UserChangePwdDto } from './dto/user_change_pwd.dto';
import { UserForgotPwdDto } from './dto/user_forgot_pwd.dto';
import { TransformDataInterceptor } from 'src/interceptor/expose_data.interceptor';
import { UserDTO } from './dto/user_show_data.dto';
import { SetMessage } from 'src/decorators/custom_response.decorator';
import { UserLoginDto } from './dto/user_login.dto';
import { SetPublic } from 'src/decorators/public_access.decorator';
import { AuthGuard } from 'src/guards/permittedUser.guard';
import { RequiredPermission } from 'src/decorators/permission.decorator';
import { permissionTypes } from 'src/constants/permission/permission_types.constant';
import { PermissionGuard } from 'src/guards/permit.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import {
  FileNameEditor,
  FileEditor,
  ImgFileEditor,
} from 'src/files/files.util';
import { FileService } from 'src/files/files.service';

@UseGuards(AuthGuard) // Apply authentication guard to all routes in this controller
@UseInterceptors(new TransformDataInterceptor(UserDTO)) // Transform response data to match UserDTO structure
@ApiTags('users') // Group this controller's endpoints under the 'users' tag in Swagger documentation
@Controller('users') // Define the base route for this controller
export class UsersController {
  constructor(
    private userService: UsersService, // Service to handle user-related operations
    private authService: AuthService, // Service to handle authentication-related operations
    private fileservice: FileService,
  ) {}

  @Post() // Endpoint to create a new user
  @SetPublic() // Mark this route as publicly accessible
  @SetMessage('Record Added') // Set a custom success message for the response
  async createNewUser(@Body() user: UserCreateDto) {
    return await this.authService.signup(user); // Call signup method from AuthService
  }

  @Get() // Endpoint to fetch all users
  @SetMessage('Fetched all records.') // Set a custom success message for the response
  async findAll() {
    const records = await this.userService.findAll(); // Fetch all user records
    if (records) {
      return records; // Return records if found
    }
    return { message: 'No record found', data: records }; // Return a message if no records are found
  }

  @Post('signin') // Endpoint for user login
  @SetPublic() // Mark this route as publicly accessible
  @SetMessage('User Logged IN!') // Set a custom success message for the response
  async signin(@Body() user: UserLoginDto) {
    return this.authService.signin(user); // Call signin method from AuthService
  }

  @ApiBearerAuth() // Require a bearer token for authentication
  @Get('profile/:id') // Endpoint to fetch a user's profile by ID
  findOne(@Param('id') id: string) {
    return this.userService.isUserExists(id); // Check if the user exists and return their profile
  }

  @RequiredPermission(permissionTypes.EDIT)
  @UseGuards(PermissionGuard)
  @Put(':id') // Endpoint to update a user's information
  @UseGuards() // Apply additional guards if necessary
  update(@Param('id') id: string, @Body() userInfo: UserUpdationDto) {
    return this.userService.update(id, userInfo); // Call update method from UsersService
  }

  @RequiredPermission(permissionTypes.DELETE)
  @UseGuards(PermissionGuard)
  @Delete(':id') // Endpoint to delete a user by ID
  remove(@Param('id') id: string) {
    return this.userService.remove(id); // Call remove method from UsersService
  }

  @SetPublic()
  @Post('reset_password') // Endpoint to request a password reset
  @SetMessage('Token sent')
  reqChangePassword(@Body() body: UserForgotPwdDto) {
    return this.authService.requestPwdChange(body); // Call requestPwdChange method from AuthService
  }

  @SetPublic()
  @Post('change-password') // Endpoint to change a user's password
  @SetMessage('Password Changed!')
  changePassword(@Body() user: UserChangePwdDto) {
    return this.authService.changePassword(user); // Call changePassword method from AuthService
  }

  @RequiredPermission(permissionTypes.ADD)
  @UseGuards(PermissionGuard)
  @Post('upload/file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/files',
        filename: FileNameEditor,
      }),
      fileFilter: FileEditor,
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
    }),
  )
  async uploadFile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('File: ', file);
    return this.fileservice.uploadFile(req, {
      filename: file.filename,
      filetype: file.mimetype,
    });
  }

  @RequiredPermission(permissionTypes.ADD)
  @UseGuards(PermissionGuard)
  @Post('upload/files')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads/files',
        filename: FileNameEditor,
      }),
      limits: {
        files: 5,
      },
      fileFilter: FileEditor,
    }),
  )
  async uploadFiles(
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const filesWithMapping = files.map((file) => ({
      filename: file.filename,
      filetype: file.mimetype,
    }));
    return await this.fileservice.uploadFiles(req, filesWithMapping);
  }

  @RequiredPermission(permissionTypes.ADD)
  @UseGuards(PermissionGuard)
  @Post('/upload/img')
  @UseInterceptors(
    FileInterceptor('img', {
      limits: {
        files: 1,
        fileSize: 500 * 1024,
      },
      storage: diskStorage({
        destination: './uploads/imgs',
        filename: FileNameEditor,
      }),
      fileFilter: ImgFileEditor,
    }),
  )
  async imageUpload(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return await this.fileservice.uploadFile(req, {
      filename: file.filename,
      filetype: file.mimetype,
    });
  }

  @RequiredPermission(permissionTypes.ADD)
  @UseGuards(PermissionGuard)
  @Post('upload/imgs')
  @UseInterceptors(
    FilesInterceptor('imgs', 3, {
      storage: diskStorage({
        destination: './uploads/files',
        filename: FileNameEditor,
      }),
      limits: {
        files: 3,
        fileSize: 500 * 1024,
      },
      fileFilter: ImgFileEditor,
    }),
  )
  async multiImageUpload(
    @Req() req: Request,
    @UploadedFiles() imgs: Array<Express.Multer.File>,
  ) {
    const filesWithMapping = imgs.map((file) => ({
      filename: file.filename,
      filetype: file.mimetype,
    }));
    return await this.fileservice.uploadFiles(req, filesWithMapping);
  }
}
