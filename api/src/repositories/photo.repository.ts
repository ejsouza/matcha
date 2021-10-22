import db from '../../db';
import debug from 'debug';

const log: debug.IDebugger = debug('app:User-repository');

class PhotoRepository {
  async upload(userId: number, path: string) {
    const query = 'INSERT INTO pictures(user_id, file_path) VALUES($1, $2)';
    return db.query(query, [userId, path]);
  }

  async list(userId: number) {
    const query = 'SELECT * FROM pictures WHERE user_id = $1';
    return db.query(query, [userId]);
  }

  async getById(id: number) {
    const query = 'SELECT * FROM pictures WHERE id = $1';
    return db.query(query, [id]);
  }

  async updateDefaultPicture(userId: number, path: string) {
    const query = 'UPDATE users SET default_picture=$1 WHERE id = $2';
    return db.query(query, [path, userId]);
  }

  async delete(id: number) {
    const query = 'DELETE FROM pictures WHERE id = $1';
    return db.query(query, [id]);
  }
}

export default new PhotoRepository();
