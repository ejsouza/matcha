import express from 'express';
import likesService from '../services/likes.service';

class LikesMiddleware {
  async alreadyLiked(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const likes = await likesService.getUserLikes(req.params.userId);

    const alreadyLiked = likes.find(
      (like) => like.liked_id === Number(req.body.liked_id)
    );

    if (alreadyLiked) {
      return res
        .status(401)
        .json({ success: false, message: 'You already liked this person' });
    }
    next();
  }

  async alreadyDisliked(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const likes = await likesService.getUserDislikes(req.params.userId);

    const alreadyDisliked = likes.find(
      (like) => like.disliked_id === Number(req.body.disliked_id)
    );

    if (alreadyDisliked) {
      return res
        .status(401)
        .json({ success: false, message: 'You already disliked this person' });
    }
    next();
  }
}

export default new LikesMiddleware();
