import db from '../../db';
import { CreateTagDto } from '../dto/tags/create.tag.dto';

class TagRepository {
  async create(tag: CreateTagDto) {
    const query = 'INSERT INTO tags(id, user_id, name) VALUES($1, $2, $3)';
    return db.query(query, [tag.id, tag.user_id, tag.name]);
  }

  async getUserTags(userId: number) {
    const query = 'SELECT * FROM tags WHERE user_id =  $1';
    return db.query(query, [userId]);
  }

  async delte(tagId: number, userId: number) {
    const query = 'DELETE FROM tags WHERE id = $1 AND user_id = $2';
    return db.query(query, [tagId, userId]);
  }
}

export default new TagRepository();
