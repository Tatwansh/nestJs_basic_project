import { Sequelize } from 'sequelize-typescript';
import { File } from 'src/files/model/files.entity';
import { Permission } from 'src/permissions/entity/permissions.entity';
import { User } from 'src/users/entity/users.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: '10.102.32.204',
        port: 5432,
        username: 'trainer',
        password: 'PG_trained',
        database: 'training',
      });
      sequelize.addModels([User, File, Permission]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
