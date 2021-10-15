import express from 'express';

class PhotoController {
  async listUserPhotos(req: express.Request, res: express.Response) {
    res.status(200).send('user photos');
  }

  async upload(req: express.Request, res: express.Response) {
    console.log(`controller.upload()`);
    res.status(200).json({ picture: req.file?.filename });
  }
}

export default new PhotoController();
