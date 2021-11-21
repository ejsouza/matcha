import db from '../../db';
import { CreateChatDto } from '../dto/chats/create.chat.dto';

class ChatRepository {
  async list(userId: number) {
    const query =
      'SELECT * FROM chats WHERE sender_id = $1 OR receiver_id = $1 ORDER BY sent_at::date DESC';

    return db.query(query, [userId]);
  }

  async listReceived(userId: number) {
    const query =
      'SELECT * FROM chats WHERE receiver_id = $1 ORDER BY sent_at::date DESC';

    return db.query(query, [userId]);
  }

  async listSent(userId: number) {
    const query =
      'SELECT * FROM chats WHERE sender_id = $1 ORDER BY sent_at::date DESC';

    return db.query(query, [userId]);
  }

  async create(resource: CreateChatDto) {
    const query =
      'INSERT INTO chats(sender_id, receiver_id, text, sent_at) VALUES($1, $2, $3, $4)';
    return db.query(query, [
      resource.sender_id,
      resource.receiver_id,
      resource.text,
      resource.sent_at,
    ]);
  }

  async setSeen(chatId: number) {
    const query = 'UPDATE chats SET seen=true WHERE id=$1';

    return db.query(query, [chatId]);
  }
}

export default new ChatRepository();
