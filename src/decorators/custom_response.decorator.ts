import { SetMetadata } from '@nestjs/common';

export const MESSAGE_KEY = 'message';

export const SetMessage = (message: string) => {
  return SetMetadata(MESSAGE_KEY, message || 'Process passed.');
};
