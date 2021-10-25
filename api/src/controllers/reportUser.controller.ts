import express from 'express';
import reportUserService from '../services/reportUser.service';
import { CreateReportDto } from '../dto/report/create.report.dto';

class ReportUserController {
  async listReportedByUser(req: express.Request, res: express.Response) {
    const { reporter_id } = req.body;

    console.log(`Controller listreportedByUser(${reporter_id})`);
    if (!reporter_id) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing requester id' });
    }

    const users = await reportUserService.listReportedByUser(
      Number(reporter_id)
    );
    res.status(200).json({ success: true, users });
  }

  async create(req: express.Request, res: express.Response) {
    const { reporter_id, reported_id } = req.body;
    if (!reporter_id || !reported_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing reporter_id and/or reported_id',
      });
    }
    const resource: CreateReportDto = {
      reported_id,
      reporter_id,
    };
    const response = await reportUserService.create(resource);

    if (response > 0) {
      return res.status(201).json({ success: true, message: 'Reported user.' });
    } else {
      return res
        .status(200)
        .json({ success: true, message: 'User not reported' });
    }
  }
}

export default new ReportUserController();
