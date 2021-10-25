import { CreateUserDto } from './create.user.dto';
import { CreateLikeDto } from '../likes/create.like.dto';
import blockUserService from '../../services/blockUser.service';
import reportUserService from '../../services/reportUser.service';
import likeService from '../../services/likes.service';
import usersService from '../../services/users.service';

export const MapUserMatchesDto = async (
  userId: string,
  matches: CreateUserDto[]
) => {
  const reportedUsers = await reportUserService.listReportedByUser(
    Number(userId)
  );
  const blockedUsers = await blockUserService.listBlockedByUser(Number(userId));
  const likedUsers = await likeService.getUserLikes(userId);

  matches = matches.filter(
    (matche) =>
      !reportedUsers.find((reported) => reported.reported_id === matche.id) &&
      !blockedUsers.find((blocked) => blocked.blocked_id === matche.id) &&
      !likedUsers.find((liked) => liked.liked_id === matche.id)
  );
  return matches;
};

export const MapUsersMatchedDto = async (
  likedBy: CreateLikeDto[],
  likes: CreateLikeDto[]
) => {
  const matches = likedBy.filter((liked) =>
    likes.find((like) => like.liked_id === liked.user_id)
  );

  return Promise.all(
    matches.map((match) => {
      return new Promise((resolve) => {
        usersService
          .getById(match.user_id.toString())
          .then((res) => resolve(res));
      });
    })
  );
};
