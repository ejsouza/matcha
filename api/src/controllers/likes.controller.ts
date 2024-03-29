import express from 'express';
import likeService from '../services/likes.service';

class LikeController {
  /**
   *
   * @param req userId
   * @param res likes[]
   */
  async getUserLikes(req: express.Request, res: express.Response) {
    const likes = await likeService.getUserLikes(req.params.userId);
    res.status(200).json({ likes });
  }

  /**
   *
   * @param req userId
   * @param res likes[]
   */
  async getLikedBy(req: express.Request, res: express.Response) {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing userId' });
    }
    const likes = await likeService.getLikedBy(userId);

    res.status(200).json({ likes });
  }

  /**
   *
   * @param req userId
   * @param res dislikes[]
   */
  async getUserDislikes(req: express.Request, res: express.Response) {
    const dislikes = await likeService.getUserDislikes(req.params.userId);
    res.status(200).json({ dislikes });
  }

  /**
   *
   * @param req userId
   * @param req liked userId
   * @param res
   */
  async addUserLike(req: express.Request, res: express.Response) {
    const { liked_id } = req.body;

    if (!liked_id) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing liked user id' });
    }

    const count = await likeService.addUserLike(req.params.userId, liked_id);
    if (count > 0) {
      res.status(201).json({ success: true, message: 'Like added' });
    } else {
      res.status(403).json({ success: false });
    }
  }

  /**
   *
   * @param req userId
   * @param req disliked userId
   * @param res
   */
  async addUserDislike(req: express.Request, res: express.Response) {
    const { disliked_id } = req.body;

    if (!disliked_id) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing disliked user id' });
    }

    const count = await likeService.addUserDislike(
      req.params.userId,
      disliked_id
    );
    if (count > 0) {
      return res.status(201).json({ success: true, message: 'Dislike added' });
    }
    res.status(403).json({ success: false });
  }

  async seen(req: express.Request, res: express.Response) {
    const id = req.params.id;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing like id' });
    }

    const count = await likeService.seen(Number(id));
    if (count > 0) {
      return res
        .status(201)
        .json({ success: true, message: 'Like set to seen' });
    }
    res.status(403).json({ success: false });
  }
}

export default new LikeController();
