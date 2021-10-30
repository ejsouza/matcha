import messagesRepository from '../repositories/messages.repository';
import { CreateMessageDto } from '../dto/messages/create.message.dto';

class MessageService {
  async listUserMessages(userId: number) {
    const res = await messagesRepository.listUserMessages(userId);
    const messages: CreateMessageDto[] = res.rows;
    return messages;
    // return await MapMessageDto(messages);
  }

  async create(from: number, to: number, message: string) {
    const resource: CreateMessageDto = {
      sender_id: from,
      receiver_id: to,
      message,
      seen: false,
      sent_at: new Date(),
    };
    const res = await messagesRepository.create(resource);
    return res.rowCount;
  }

  async upate(messageId: number) {
    const res = await messagesRepository.update(messageId);

    return res.rowCount;
  }

  async delete(messageId: number) {
    const res = await messagesRepository.delete(messageId);

    return res.rowCount;
  }
}

export default new MessageService();
