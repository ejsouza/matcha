export interface CreateLikeDto {
  user_id: number;
  liked_id: number;
}

export interface CreateDislikeDto {
  user_id: number;
  disliked_id: number;
}
