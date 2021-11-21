import likesRepository from '../repositories/likes.repository';
import { CreateLikeDto, CreateDislikeDto } from '../dto/likes/create.like.dto';
import usersService from './users.service';

class LikeService {
  async getUserLikes(userId: string) {
    const res = await likesRepository.getUserLikes(userId);
    const likes: CreateLikeDto[] = res.rows;
    return likes;
  }

  async getLikedBy(userId: string) {
    const res = await likesRepository.getLikedBy(userId);
    const likes: CreateLikeDto[] = res.rows;
    return likes;
  }

  async getUserDislikes(userId: string) {
    const res = await likesRepository.getUserDislikes(userId);
    const dislikes: CreateDislikeDto[] = res.rows;
    return dislikes;
  }

  async addUserLike(userId: string, likedId: string) {
    const like: CreateLikeDto = {
      user_id: Number(userId),
      liked_id: Number(likedId),
      seen: false,
    };
    const res = await likesRepository.addUserLike(like);
    const count = res.rowCount;
    if (count > 0) {
      console.log('Update increasePopularity()');
      await usersService.increaseUserPopularity(Number(likedId));
    }
    return count;
  }

  async addUserDislike(userId: string, dislikedId: string) {
    const dislike: CreateDislikeDto = {
      user_id: Number(userId),
      disliked_id: Number(dislikedId),
    };
    const res = await likesRepository.addUserDislike(dislike);
    const count = res.rowCount;
    if (count > 0) {
      console.log('Update decreasePopularity()');
      await usersService.decreaseUserPopularity(Number(dislikedId));
    }
    return count;
  }

  async seen(id: number) {
    const res = await likesRepository.seen(id);
    return res.rowCount;
  }
}

export default new LikeService();
