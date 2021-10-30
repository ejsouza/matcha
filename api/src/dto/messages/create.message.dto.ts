import { CreateUserDto, UserDto } from '../../dto/users/create.user.dto';
import { CreateLikeDto } from '../likes/create.like.dto';
import userService from '../../services/users.service';
import tagsService from '../../services/tags.service';
import photosService from '../../services/photos.service';
import likesService from '../../services/likes.service';

export interface CreateMessageDto {
  id?: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  seen: boolean;
  sent_at: Date;
}

export interface MessageDto {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  seen: boolean;
  sent_at: Date;
}

interface MessageMapToUser extends UserDto {
  messages: CreateMessageDto[];
  likes: CreateLikeDto[];
  user: CreateUserDto;
}

/**
 * WARNING: not in use probably to be delted.
 */
const MapMessageDto = async (messages: CreateMessageDto[]): Promise<any> => {
  /**
   * The messages array can contain many different message from same user
   * for that reasion we filter the array to keep one per user
   */
  const filteredMessages = <CreateMessageDto[]>[];
  messages.forEach((message) => {
    const includes = filteredMessages.find(
      (msg) => msg.sender_id === message.sender_id
    );
    if (!includes) {
      filteredMessages.push(message);
    }
  });
  return Promise.all(
    filteredMessages.map((filteredMessage) => {
      return new Promise((resolve) => {
        userService
          .getById(filteredMessage.sender_id.toString())
          .then((res) => res)
          .then(async (usr) => {
            let mappedUser = <MessageMapToUser>{};
            mappedUser.user = usr;
            mappedUser.messages = messages.filter(
              (message) => message.sender_id === filteredMessage.sender_id
            );
            mappedUser.tags = await tagsService.getUserTags(usr.id.toString());
            mappedUser.pictures = await photosService.list(usr.id);
            mappedUser.likes = await likesService.getUserLikes(
              usr.id.toString()
            );
            resolve(mappedUser);
          });
      });
    })
  );
};
