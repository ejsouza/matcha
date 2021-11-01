import chatRepository from '../repositories/chat.repository';
import { CreateChatDto } from '../dto/chats/create.chat.dto';

class ChatService {
  async list(userId: number) {
    const res = await chatRepository.list(userId);
    const chats: CreateChatDto[] = res.rows;

    return chats;
  }

  async listReceived(userId: number) {
    const res = await chatRepository.listReceived(userId);
    const chats: CreateChatDto[] = res.rows;

    return chats;
  }

  async listSent(userId: number) {
    const res = await chatRepository.listSent(userId);
    const chats: CreateChatDto[] = res.rows;

    return chats;
  }

  async create(from: number, to: number, text: string) {
    const resource: CreateChatDto = {
      sender_id: from,
      receiver_id: to,
      text,
      sent_at: new Date(),
    };
    const res = await chatRepository.create(resource);

    return res.rowCount;
  }
}

export default new ChatService();
