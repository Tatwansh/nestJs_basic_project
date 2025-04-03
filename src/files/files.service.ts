import { Injectable } from '@nestjs/common';
import { FileRepo } from './repository/files.repository';
import { Request } from 'express';
import { FileUploadDTO } from './dto/upload_file.dto';

@Injectable()
export class FileService {
  constructor(private fileRepo: FileRepo) {}

  async uploadFile(req: Request, data: FileUploadDTO) {
    try {
      // Ensure req.user exists before accessing it
      if (!req.user || !req.user['sub']) {
        throw new Error('User not authenticated');
      }

      const userId = req.user['sub']['id'];
      data['userId'] = userId;
      return await this.fileRepo.uploadFile(data);
    } catch (error) {
      // Log or handle the error as needed
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async uploadFiles(req: Request, data: FileUploadDTO[]) {
    try {
      // Ensure req.user exists before accessing it
      if (!req.user || !req.user['sub']) {
        throw new Error('User not authenticated');
      }

      const userId = req.user['sub']['id'];

      // Use map to avoid mutation of original array
      const filesWithUserId = data.map((file) => {
        return { ...file, userId }; // Add userId safely
      });

      return await this.fileRepo.uploadFiles(filesWithUserId);
    } catch (error) {
      // Log or handle the error as needed
      throw new Error(`Failed to upload files: ${error.message}`);
    }
  }

  async showFilesByUser(req: Request) {
    try {
      // Ensure req.user exists before accessing it
      if (!req.user || !req.user['sub']) {
        throw new Error('User not authenticated');
      }

      const userId = req.user['sub']['id'];
      return await this.fileRepo.findByUser(userId);
    } catch (error) {
      // Log or handle the error as needed
      throw new Error(`Failed to retrieve files: ${error.message}`);
    }
  }
}
