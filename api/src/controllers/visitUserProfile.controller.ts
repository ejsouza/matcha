import express from 'express';
import visitUserProfileService from '../services/visitUserProfile.service';

class VisitUserProfileController {
  async list(req: express.Request, res: express.Response) {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Missing userId' });
    }
    const visits = await visitUserProfileService.list(Number(userId));
    return res.status(200).json({ visits });
  }

  async create(req: express.Request, res: express.Response) {
    const { visiteeId, visitorId } = req.body;

    if (!visiteeId || !visitorId) {
      return res.status(401).json({
        success: false,
        message: 'Missing visiteeId and/or visitorId',
      });
    }
    const count = await visitUserProfileService.create(visitorId, visiteeId);
    if (count > 0) {
      return res.status(201).json({ success: true, message: 'Visit added' });
    } else {
      return res.status(403).send();
    }
  }
  async update(req: express.Request, res: express.Response) {
    const { visiteeId, visitorId } = req.body;

    if (!visiteeId || !visitorId) {
      return res.status(401).json({
        success: false,
        message: 'Missing visiteeId and/or visitorId',
      });
    }
    const count = await visitUserProfileService.update(visitorId, visiteeId);
    if (count > 0) {
      return res.status(201).json({ success: true, message: 'Visit added' });
    } else {
      return res.status(403).send();
    }
  }

  async getVisitByVisitId(req: express.Request, res: express.Response) {
    const { visiteeId, visitorId } = req.body;

    if (!visiteeId || !visitorId) {
      return res.status(401).json({
        success: false,
        message: 'Missing visiteeId and/or visitorId',
      });
    }
    const visit = await visitUserProfileService.getVisitByVisitId(
      visitorId,
      visiteeId
    );
    return visit;
  }

  async put(req: express.Request, res: express.Response) {
    const { visiteeId, visitorId } = req.body;

    if (!visiteeId || !visitorId) {
      return res.status(401).json({
        success: false,
        message: 'Missing visiteeId and/or visitorId',
      });
    }
    const count = await visitUserProfileService.put(visitorId, visiteeId);
    if (count > 0) {
      return res.status(201).json({ success: true, message: 'Visit added' });
    } else {
      return res.status(403).send();
    }
  }
}

export default new VisitUserProfileController();
