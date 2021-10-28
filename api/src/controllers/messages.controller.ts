import express from 'express';
import messagesService from '../services/messages.service';

class MessageController {
  async listUserMessages(req: express.Request, res: express.Response) {
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).send();
    }
    const messages = await messagesService.listUserMessages(userId);
    res.status(200).json({ messages });
  }

  async update(req: express.Request, res: express.Response) {
    const { messageId } = req.params;
    if (!messageId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing messageId' });
    }
    const count = await messagesService.upate(Number(messageId));

    if (count > 0) {
      return res
        .status(201)
        .json({ success: true, message: 'Set message to seen' });
    } else {
      return res.status(403).send();
    }
  }

  async create(req: express.Request, res: express.Response) {
    const { sender_id, receiver_id, message } = req.body;

    if (!sender_id || !receiver_id || !message) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing fields' });
    }

    const count = await messagesService.create(sender_id, receiver_id, message);

    if (count > 0) {
      return res
        .status(201)
        .json({ success: true, message: 'Message created' });
    } else {
      return res.status(403).send();
    }
  }

  async delete(req: express.Request, res: express.Response) {
    const { messageId } = req.params;
    if (!messageId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing messageId' });
    }
    const count = await messagesService.delete(Number(messageId));

    if (count > 0) {
      return res
        .status(201)
        .json({ success: true, message: 'Message removed' });
    } else {
      return res.status(403).send();
    }
  }
}

export default new MessageController();
