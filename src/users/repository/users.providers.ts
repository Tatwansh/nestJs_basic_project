import { User } from '../entity/users.entity';

export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
];
