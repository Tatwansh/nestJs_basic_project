import { SetMetadata } from '@nestjs/common';

export const PublicAccess = 'isPublic';

export const SetPublic = () => SetMetadata(PublicAccess, true);
