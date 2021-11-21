import tagsService from '../../services/tags.service';
import photosService from '../../services/photos.service';
import { CreateLikeDto } from '../likes/create.like.dto';
import { CreateVisitUserProfileDto } from '../visits/createvisitUserProfile.dto';
import { CreateTagDto } from '../tags/create.tag.dto';
import { CreateMessageDto } from '../messages/create.message.dto';

export interface CreateUserDto {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  gender?: string;
  sexual_orientation?: string;
  birthdate?: Date;
  biography?: string;
  localisation?: {
    x: number;
    y: number;
  };
  activated?: boolean;
  created_at?: Date;
  updated_at?: Date;
  default_picture?: string;
  is_connected?: number;
  popularity?: number;
  reported?: boolean;
  distance_preference?: number;
  age_preference_min?: number;
  age_preference_max?: number;
  rate?: number;
}

export interface UserDto extends CreateUserDto {
  tags: {
    id: number;
    user_id?: number;
    name: string;
  }[];
  pictures: {
    id: number;
    path: string;
  }[];
}

interface UserPicturesDto {
  id: number;
  path: string;
}

export interface UserMapedDto {
  user: CreateUserDto;
  likes: CreateLikeDto[];
  visits: CreateVisitUserProfileDto[];
  tags: CreateTagDto[];
  pictures: UserPicturesDto[];
  messages: CreateMessageDto[];
}

export const MapUserDto = async (data: CreateUserDto[]) => {
  return Promise.all(
    data.map((usr) => {
      const userId = usr.id.toString();
      return new Promise((resolve) => {
        tagsService
          .getUserTags(userId)
          .then((res) => {
            return res;
          })
          .then(async (tags) => {
            let u = <UserDto>{ ...usr };
            u.tags = [];
            for (let i = 0; i < tags.length; i++) {
              u.tags.push(tags[i]);
            }
            await new Promise((resolve) => {
              photosService
                .list(Number(userId))
                .then((res) => res)
                .then((pics) => {
                  u.pictures = [];
                  for (let y = 0; y < pics.length; y++) {
                    let pic: UserPicturesDto = {
                      id: pics[y].id,
                      path: pics[y].file_path,
                    };
                    u.pictures.push(pic);
                  }
                  resolve(u);
                });
            });
            return resolve(u);
          });
      });
    })
  );
};
