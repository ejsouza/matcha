export interface CreateLikeDto {
  id?: number;
  user_id: number;
  liked_id: number;
  seen: boolean;
}

export interface CreateDislikeDto {
  user_id: number;
  disliked_id: number;
}
