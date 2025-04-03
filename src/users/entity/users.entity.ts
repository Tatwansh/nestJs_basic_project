import { Column, DataType, Table, Model, HasMany } from 'sequelize-typescript';
import { File } from 'src/files/model/files.entity';
import { Permission } from 'src/permissions/entity/permissions.entity';

@Table({ tableName: 'Task1_Tatwansh_Users' })
export class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;
  @Column({ allowNull: false, type: DataType.STRING })
  name: string;
  @Column({ allowNull: false })
  password: string;
  @Column({ allowNull: false, unique: true, type: DataType.STRING })
  email: string;
  @Column({ allowNull: true, type: DataType.BIGINT })
  phone?: number;
  @Column({ allowNull: false, type: DataType.STRING, defaultValue: '' })
  random_access_token: string;
  @HasMany(() => Permission)
  permissions: Permission[];
  @HasMany(() => File)
  files: File[];
}
