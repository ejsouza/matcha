import express from 'express';
import blockUserService from '../services/blockUser.service';
import { CreateBlockDto } from '../dto/block/create.block.dto';

class BlockUserController {
  async listBlockedByUser(req: express.Request, res: express.Response) {
    const blocker_id = req.body;

    if (!blocker_id) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing requester id' });
    }

    const users = await blockUserService.listBlockedByUser(Number(blocker_id));
    res.status(200).json({ success: true, users });
  }

  async create(req: express.Request, res: express.Response) {
    const { blocker_id, blocked_id } = req.body;
    if (!blocker_id || !blocked_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing blocker_id and/or blocked_id',
      });
    }
    const resource: CreateBlockDto = {
      blocked_id,
      blocker_id,
    };
    const response = await blockUserService.create(resource);

    if (response > 0) {
      return res.status(201).json({ success: true, message: 'Blocked user.' });
    } else {
      return res
        .status(200)
        .json({ success: true, message: 'User not blocked' });
    }
  }
}

export default new BlockUserController();
