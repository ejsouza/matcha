import express from 'express';
import chatService from '../services/chats.service';

class ChatController {
  /**
   * @param is comming in a query string
   * @query /chat?userId=id
   */
  async list(req: express.Request, res: express.Response) {
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Missing userId' });
    }
    const chats = await chatService.list(Number(userId));

    res.status(200).json({ chats });
  }

  async listReceived(req: express.Request, res: express.Response) {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Missing userId' });
    }
    const chats = await chatService.listReceived(Number(userId));

    res.status(200).json({ chats });
  }

  async listSent(req: express.Request, res: express.Response) {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Missing userId' });
    }
    const chats = await chatService.listSent(Number(userId));

    res.status(200).json({ chats });
  }

  async create(req: express.Request, res: express.Response) {
    const { sender_id, receiver_id, text } = req.body;

    if (!sender_id || !receiver_id || !text) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing fields' });
    }
    const count = await chatService.create(sender_id, receiver_id, text);

    if (count > 0) {
      return res.status(201).json({ success: true, message: 'Chat sent' });
    } else {
      return res.status(403).send();
    }
  }

  async setSeen(req: express.Request, res: express.Response) {
    const chatId = req.params.id;
    console.log(`setSeen(${chatId})`);
    if (!chatId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing chatId' });
    }
    const count = await chatService.setSeen(Number(chatId));

    if (count > 0) {
      return res.status(201).json({ success: true, message: 'Chat seen' });
    } else {
      return res.status(403).send();
    }
  }
}

export default new ChatController();
