import db from '../../db';
import { CreateLikeDto, CreateDislikeDto } from '../dto/likes/create.like.dto';

class LikeRepository {
  async getUserLikes(userId: string) {
    const query = 'SELECT * FROM likes WHERE user_id = $1';
    return db.query(query, [userId]);
  }

  async getLikedBy(userId: string) {
    const query = 'SELECT * FROM likes WHERE liked_id = $1';
    return db.query(query, [userId]);
  }

  async getUserDislikes(userId: string) {
    const query = 'SELECT * FROM dislikes WHERE user_id = $1';
    return db.query(query, [userId]);
  }

  async addUserLike(like: CreateLikeDto) {
    const query = 'INSERT INTO likes(user_id, liked_id) VALUES($1, $2)';
    return db.query(query, [like.user_id, like.liked_id]);
  }

  async addUserDislike(dislike: CreateDislikeDto) {
    const query = 'INSERT INTO dislikes(user_id, disliked_id) VALUES($1, $2)';
    return db.query(query, [dislike.user_id, dislike.disliked_id]);
  }

  async seen(id: number) {
    const query = 'UPDATE likes SET seen = $2 WHERE id = $1';
    return db.query(query, [id, true]);
  }
}

export default new LikeRepository();
