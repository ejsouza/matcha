import db from '../../db';
import { CreateBlockDto } from '../dto/block/create.block.dto';

class BlockUserRepository {
  async listBlockedByUser(userId: number) {
    const query = 'SELECT * FROM blocked_users WHERE blocker_id = $1';
    return db.query(query, [userId]);
  }

  async create(resource: CreateBlockDto) {
    const query = 'INSERT INTO blocked_users VALUES ($1, $2)';
    return db.query(query, [resource.blocker_id, resource.blocked_id]);
  }
}

export default new BlockUserRepository();
