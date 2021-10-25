import tagsService from '../../services/tags.service';
import photosService from '../../services/photos.service';

export interface CreateUserDto {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  gender?: string;
  sexual_orientation?: string;
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
}

interface UserDto extends CreateUserDto {
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

interface UserMapedDto extends CreateUserDto, UserDto, UserPicturesDto {}

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
