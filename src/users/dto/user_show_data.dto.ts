import { Expose, Transform } from 'class-transformer';

export class UserDTO {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  phone: number;
  @Expose()
  // @Transform()
  permissions: any;
}
