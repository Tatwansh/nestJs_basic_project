import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Task1_Tatwansh_Sample',
  createdAt: false,
  updatedAt: false,
})
export class Sample extends Model {
  @Column({ allowNull: false, type: DataType.STRING })
  name: string;

  @Column({ allowNull: true, type: DataType.STRING })
  phoneNo: string;
}
