import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import photoController from '../controllers/photos.controller';
import photoMiddleware from '../middleware/photos.middleware';
import authMiddleware from '../middleware/auth.middleware';
import multer from 'multer';
import photosController from '../controllers/photos.controller';

interface MulterCallBack {
  (arg0: null, arg1: boolean): void;
}

const storage = multer.diskStorage({
  destination: './uploads/',

  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}${file.originalname}`);
  },
});

const fileFilter = (
  req: express.Request,
  file: Express.Multer.File,
  cb: MulterCallBack
) => {
  /**
   * reject file if not jpeg/png
   */
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fieldSize: 1024 * 1024 * 2, // 2Mb
  },
  fileFilter,
});

export class PhotoRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'PhotoRoutes');
  }

  configureRoutes() {
    this.app
      .route(`/photos`)
      .get(photoMiddleware.validJWTNeeded, photoController.listUserPhotos)
      .post(
        photoMiddleware.validJWTNeeded,
        upload.single('uploaded_file'),
        photoMiddleware.photoMimetype,
        photoController.upload
      );

    this.app
      .route(`/photos/:id`)
      .get(photoMiddleware.validJWTNeeded, photosController.getById)
      .delete(photoMiddleware.validJWTNeeded, photosController.delete);

    return this.app;
  }
}
