import express from 'express';
import { retrieveUserIdFromToken } from '../utils/user';
import photosService from '../services/photos.service';

class PhotoController {
  async listUserPhotos(req: express.Request, res: express.Response) {
    const userId = retrieveUserIdFromToken(req);

    const pictures = await photosService.list(Number(userId));
    res.status(200).json({ pictures });
  }

  async upload(req: express.Request, res: express.Response) {
    console.log(`controller.upload()`);
    console.log(req.file);

    const userId = retrieveUserIdFromToken(req);

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Invalid file' });
    }
    await photosService.create({
      userId: Number(userId),
      path: req.file?.filename,
    });
    res.status(201).json({ success: true, message: 'File uploaded' });
  }

  async getById(req: express.Request, res: express.Response) {
    const picture = await photosService.getById(req.params.id);
    return res.status(200).json({ picture });
  }

  async delete(req: express.Request, res: express.Response) {
    const response = await photosService.delete(req.params.id);
    return res.status(200).json({ message: `File ${response}` });
  }
}

export default new PhotoController();
