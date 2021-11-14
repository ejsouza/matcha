import db from '../../db';
import { CreateMatchDto } from '../dto/matches/create.match.dto';

class MatchRepository {
  async get(userId: number) {
    const query = 'SELECT * FROM matches WHERE user_id = $1';

    return db.query(query, [userId]);
  }

  async create(resource: CreateMatchDto) {
    const query =
      'INSERT INTO matches(user_id, seen) VALUES($1, $2) RETURNING *';
    return db.query(query, [resource.user_id, resource.seen]);
  }

  async update(id: number) {
    const query = 'UPDATE matches SET seen = $2, WHERE id = $1';
    return db.query(query, [id, true]);
  }

  async delete(id: number) {
    const query = 'DELETE FROM matches WHERE id = $1';
    return db.query(query, [id]);
  }
}

export default new MatchRepository();
