import { CreateLikeDto, CreateDislikeDto } from './create.like.dto';

/**
 *
 * @param likesMe
 * @param likes
 * @param dislikes
 * @res  array[] of unique liked user
 */
export const MapUsersLikedMeDto = async (
  likesMe: CreateLikeDto[],
  likes: CreateLikeDto[],
  dislikes: CreateDislikeDto[]
) => {
  const filteredLikes: CreateLikeDto[] = [];
  /**
   * Filter likes
   * This map will check in the likesMe array for unique id
   * if current user liked or disliked the id will be removed.
   * The goal is to return only id that liked the current user
   * that the current user didn't like or dislike yet.
   */
  likesMe.forEach((user) => {
    /**
     * Check if current user also liked who liked the user
     */
    const isMatch = likes.find((like) => like.liked_id === user.user_id);
    /**
     * Check if current user diliked who liked the user
     */
    const disliked = dislikes.find(
      (dislike) => dislike.disliked_id === user.user_id
    );

    if (!isMatch && !disliked) {
      filteredLikes.push(user);
    }
  });
  return filteredLikes;
};
