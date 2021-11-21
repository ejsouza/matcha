import express from 'express';
import matchService from '../services/matches.service';

class MatchController {
  async get(req: express.Request, res: express.Response) {
    /**
     * We extract the userId from the token in tokenMiddleware
     * and we set it in the body to have access to it here.
     */
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing userId' });
    }

    const matches = await matchService.get(Number(userId));
    res.status(200).json({ matches });
  }

  async create(req: express.Request, res: express.Response) {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing userId' });
    }
    const count = await matchService.create(userId);

    if (count > 0) {
      return res.status(201).json({ success: true, message: 'Match created' });
    }
    res.status(200).json({ success: false, message: 'Could not create match' });
  }

  async update(req: express.Request, res: express.Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing id' });
    }
    const count = await matchService.update(Number(id));

    if (count > 0) {
      return res.status(200).json({ success: true, message: 'Match updated' });
    }
    res.status(400).json({ success: false, message: 'Record not found' });
  }

  async delete(req: express.Request, res: express.Response) {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing userId' });
    }

    const count = await matchService.deleteAllMatches(Number(userId));

    if (count > 0) {
      return res.status(200).json({ success: true, message: 'Match deleted' });
    }
    res.status(400).json({ success: false, message: 'Record not found' });
  }
}

export default new MatchController();
