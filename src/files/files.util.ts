import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const FileNameEditor = (
  req: Request,
  file: any,
  callback: (err: any, filename: string) => void,
) => {
  const newFileName = 'test_' + file.originalname;
  console.log(newFileName);
  callback(null, newFileName);
};

export const FileEditor = (
  req: Request,
  file: any,
  callback: (err: any, valid: boolean) => void,
) => {
  console.log('File:', file);
  const accepted_formats = ['application/pdf', 'text/plain'];
  if (!file.originalname || !accepted_formats.includes(file.mimetype)) {
    callback(
      new BadRequestException('File must be of .pdf or .txt type.'),
      false,
    );
  }
  callback(null, true);
};

export const ImgFileEditor = (
  req: Request,
  file: any,
  callback: (err: any, valid: boolean) => void,
) => {
  console.log(file);
  const accepted_formats = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
  ];
  if (!file.originalname || !accepted_formats.includes(file.mimetype)) {
    callback(new BadRequestException('Not of valid image type'), false);
  }
  callback(null, true);
};
