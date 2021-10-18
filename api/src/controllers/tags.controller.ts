import express from 'express';
import { CreateTagDto } from '../dto/tags/create.tag.dto';
import usersService from '../services/users.service';
import tagService from '../services/tags.service';
import baseTags from '../config/base.tags';

class TagController {
  async list(req: express.Request, res: express.Response) {
    const tags = await tagService.list(req.params.userId);

    return res.status(200).json({ tags });
  }

  async create(req: express.Request, res: express.Response) {
    const { userId, tagId } = req.body;

    if (!userId || !tagId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing userId/tagId' });
    }

    const user = await usersService.getById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    const tag: CreateTagDto = baseTags.filter((tag) => {
      if (tag.id === Number(tagId)) {
        return tag;
      }
    })[0];

    if (tag) {
      tag.user_id = userId;
      const count = await tagService.create(tag);
      if (count > 0) {
        res.status(200).json({ success: true, message: 'Tag created' });
      } else {
        res.status(404).json({
          success: false,
          message: 'Could not create tag, try again later.',
        });
      }
    } else {
      return res.status(400).json({ message: 'Invalid tag' });
    }
  }

  async getUserTags(req: express.Request, res: express.Response) {
    const tags = await tagService.getUserTags(req.params.userId);
    return res.status(200).json({ tags });
  }

  /**
   *
   * @param req.params	userId
   * @param req.body		tagId
   * @param res.ok			200
   * @param res.error		404
   *
   */
  async delete(req: express.Request, res: express.Response) {
    const userId = req.params.userId;
    const { tagId } = req.body;

    /**
     * No need to check for userId, it is already
     * done in the middleware.
     */
    if (!tagId) {
      return res
        .status(404)
        .json({ success: false, message: 'Missing tag id' });
    }

    const count = await tagService.delete(userId, tagId);
    if (count > 0) {
      res.status(200).json({ success: true, message: 'Tag deleted' });
    } else {
      res.status(404).json({ success: false, message: 'Tag not found' });
    }
  }
}

export default new TagController();
