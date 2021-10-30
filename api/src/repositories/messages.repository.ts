import db from '../../db';
import { CreateMessageDto } from '../dto/messages/create.message.dto';

class MessageRepository {
  async listUserMessages(userId: number) {
    const query =
      'SELECT * FROM messages WHERE receiver_id = $1 ORDER BY sent_at::date DESC';

    return db.query(query, [userId]);
  }

  async listUnreadMessages(userId: number) {
    const query = 'SELECT  FROM messages WHERE receiver_id = $1 AND seen=false';

    return db.query(query, [userId]);
  }

  async create(resource: CreateMessageDto) {
    const query =
      'INSERT INTO messages(sender_id, receiver_id, message, seen, sent_at) VALUES($1, $2, $3, $4, $5)';

    return db.query(query, [
      resource.sender_id,
      resource.receiver_id,
      resource.message,
      resource.seen,
      resource.sent_at,
    ]);
  }

  async update(messageId: number) {
    const query = 'UPDATE messages SET seen=true WHERE id=$1';

    return db.query(query, [messageId]);
  }

  async delete(messageId: number) {
    const query = 'DELETE FROM messages WHERE id = $1';

    return db.query(query, [messageId]);
  }
}

export default new MessageRepository();
