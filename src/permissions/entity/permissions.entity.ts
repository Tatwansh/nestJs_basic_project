import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entity/users.entity';

@Table({ tableName: 'Task1_Tatwansh_Permissons' })
export class Permission extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.UUID })
  @ForeignKey(() => User)
  userId: User['id'];

  @Column({ type: DataType.STRING })
  action: string;
}
