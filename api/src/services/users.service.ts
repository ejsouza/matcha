import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sub, isWithinInterval, parseISO } from 'date-fns';
import haversine from 'haversine-distance';
import { CRUD } from '../common/interfaces/crud.interface';
import { CreateUserDto, UserMapedDto } from '../dto/users/create.user.dto';
import { PatchUserDto } from '../dto/users/patch.user.dto';
import { MapUserMatchesDto } from '../dto/users/match.user.dto';
import { MapUsersLikedMeDto } from '../dto/likes/likes.user.dto';
import userRepository from '../repositories/user.repository';
import messageService from './messages.service';
import likeService from './likes.service';
import photoService from './photos.service';
import tagService from './tags.service';
import visitUserProfileService from './visitUserProfile.service';
import { sendMail } from '../utils/email';
import { SALT_ROUNDS, KM } from '../config/const';

enum SexualOrientation {
  Straight = 'straight',
  Bisexual = 'bisexual',
  Gay = 'gay',
}

enum UserGender {
  Male = 'male',
  Female = 'female',
}

class UserService implements CRUD {
  async create(resource: CreateUserDto) {
    resource.password = await bcrypt.hash(resource.password, SALT_ROUNDS);
    const res = await userRepository.addUser(resource);
    const user: CreateUserDto = res.rows[0];

    /**
     * Send email
     */
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    const r = sendMail(user.email, token);

    return user;
  }

  async deleteUser(id: string) {
    return userRepository.deleteUser(id);
  }

  async list(limit: number, page: number) {
    const res = await userRepository.getUsers();
    const users: CreateUserDto[] = res.rows;
    users.forEach((user) => {
      user.password = '';
    });
    return users;
  }

  async match(requester: string) {
    const userRes = await userRepository.getUserById(requester);
    const user: CreateUserDto = userRes.rows[0];
    let query = '';
    if (!user) {
      return [];
    }
    if (user.gender === UserGender.Female) {
      switch (user.sexual_orientation) {
        case SexualOrientation.Straight:
          query = `SELECT * FROM users WHERE gender='male'`;
          break;
        case SexualOrientation.Gay:
          query = `SELECT * FROM users WHERE gender='female'`;
          break;
        default:
          query = `SELECT * FROM users`;
          break;
      }
    } else {
      switch (user.sexual_orientation) {
        case SexualOrientation.Straight:
          query = `SELECT * FROM users WHERE gender='female'`;
          break;
        case SexualOrientation.Gay:
          query = `SELECT * FROM users WHERE gender='male'`;
          break;
        default:
          query = `SELECT * FROM users`;
          break;
      }
    }
    const res = await userRepository.match(query);
    const rawUsers: CreateUserDto[] = res.rows;
    let matches: CreateUserDto[] = [];
    if (user.gender === UserGender.Female) {
      switch (user.sexual_orientation) {
        case SexualOrientation.Straight:
          matches = rawUsers.filter(
            (user) => user.sexual_orientation !== SexualOrientation.Gay
          );
          break;
        case SexualOrientation.Gay:
          matches = rawUsers.filter(
            (user) => user.sexual_orientation !== SexualOrientation.Straight
          );
          break;
        default:
          matches = rawUsers.filter(
            (user) =>
              (user.gender === UserGender.Male &&
                user.sexual_orientation !== SexualOrientation.Gay) ||
              (user.gender === UserGender.Female &&
                user.sexual_orientation !== SexualOrientation.Straight)
          );
          break;
      }
    } else {
      switch (user.sexual_orientation) {
        case SexualOrientation.Straight:
          matches = rawUsers.filter(
            (user) => user.sexual_orientation !== SexualOrientation.Gay
          );
          break;
        case SexualOrientation.Gay:
          matches = rawUsers.filter(
            (user) => user.sexual_orientation !== SexualOrientation.Straight
          );
          break;
        default:
          matches = rawUsers.filter(
            (user) =>
              (user.gender === UserGender.Female &&
                user.sexual_orientation !== SexualOrientation.Gay) ||
              (user.gender === UserGender.Male &&
                user.sexual_orientation !== SexualOrientation.Straight)
          );
          break;
      }
    }
    /**
     *  Clean matches on age preference
     */
    matches = matches.filter((match) => {
      return (
        match.birthdate &&
        isWithinInterval(match.birthdate, {
          start: sub(new Date(), {
            years: user.age_preference_max,
          }),
          end: sub(new Date(), {
            years: user.age_preference_min,
          }),
        })
      );
    });

    /**
     * Clean matches on distance preference and rank user
     */
    const rankedMatches: CreateUserDto[] = [];
    const userTags = await tagService.getUserTags(user.id.toString());
    const a = {
      lat: user.localisation?.y || 0,
      lng: user.localisation?.x || 0,
    };

    for (const match of matches) {
      const b = {
        lat: match.localisation?.y || 0,
        lon: match.localisation?.x || 0,
      };
      const dist = haversine(a, b) / KM;
      if (
        /**
         * Remove users that doesn't have a default picture
         */
        match.default_picture &&
        user.distance_preference &&
        dist <= user.distance_preference &&
        match.id !== user.id
      ) {
        const matchTags = await tagService.getUserTags(match.id.toString());
        let countTags = 0;
        /**
         * tags
         * For each matching tags between current user
         * and potential match we add one to the rate by the end.
         */
        userTags.forEach((tag) => {
          if (matchTags.find((t) => t.id === tag.id)) {
            countTags++;
          }
        });
        /**
         * bonusDistance
         * The far the distance smaller bonus distance you get
         * ex1:
         *    dist = 400;
         *    100 - Math.floor(400) / 10 = 60;
         *    bonusDistance = 60;
         * ex2:
         *    dist = 40;
         *    100 - Math.floor(40) / 10 = 96;
         *    bonusDistance = 96;
         */
        const bonusDistance = 100 - Math.floor(dist) / 10;
        /**
         * malusDistance
         * The far the distance the bigger the malus.
         * The malus is vey small compared to the bonus
         * ex1:
         *    malusDistance = Math.flor(400) / 100 = 4
         * * ex2:
         *    malusDistance = Math.flor(40) / 100 = 0.4
         */
        const malusDistance =
          dist > 0 ? Number((Math.floor(dist) / 100).toFixed(1)) : 0;
        match.rate! += bonusDistance + countTags + match.popularity!;

        /**
         * malusHundredPlusKm
         * 10% of distance is added if distance > 100.
         * WARNING
         * we add but actually this will be 10% added
         * to the malusDistance that will be subtracted
         * from rate.
         * The higher rate you have the closer you get
         * to the top of the sorted list.
         */
        const malusHundredPlusKm = dist > 100 ? Math.floor(dist / 10) : 0;
        match.rate! -= malusDistance + malusHundredPlusKm;
        rankedMatches.push(match);
      }
    }
    return await MapUserMatchesDto(requester, rankedMatches);
  }

  async getById(id: string) {
    const res = await userRepository.getUserById(id);

    return res.rows[0] as CreateUserDto;
  }

  async getUserByEmail(email: string) {
    const res = await userRepository.getUserByEmail(email);

    return res.rows[0] as CreateUserDto;
  }

  async getUserByUsername(username: string) {
    const res = await userRepository.getUserByUsername(username);

    return res.rows[0] as CreateUserDto;
  }

  async getUserAllDetails(userId: string): Promise<UserMapedDto> {
    return new Promise(async (resolve) => {
      const user_details = <UserMapedDto>{};
      user_details.user = await this.getById(userId);
      user_details.visits = await visitUserProfileService.list(Number(userId));
      user_details.likes = await likeService.getUserLikes(userId);
      user_details.messages = await messageService.listUserMessages(
        Number(userId)
      );
      user_details.pictures = await photoService.list(Number(userId));
      user_details.tags = await tagService.getUserTags(userId);

      resolve(user_details);
    });
  }

  async getUserWithoutPassword(username: string) {
    const res = await userRepository.getUserWithoutPassword(username);

    return res.rows[0] as CreateUserDto;
  }

  async getUserLikedBy(userId: string) {
    const likedByUsers = await likeService.getLikedBy(userId);
    const likes = await likeService.getUserLikes(userId);
    const dislikes = await likeService.getUserDislikes(userId);

    const filteredLikes = await MapUsersLikedMeDto(
      likedByUsers,
      likes,
      dislikes
    );

    return Promise.all(
      filteredLikes.map((like) => {
        const liked_by = like.user_id;
        return new Promise((resolve) => {
          this.getById(liked_by.toString()).then((user) => resolve(user));
        });
      })
    );
  }

  async updateLastSeen(username: string) {
    const user = await this.getUserByUsername(username);

    if (user) {
      await userRepository.updateLastSeen(user.id);
    }
  }

  async patchById(id: string, resource: PatchUserDto) {
    const res = await userRepository.patchUser(id, resource);
    const user: CreateUserDto = res.rows[0];
    if (user) {
      user.password = '';
    }
    return user;
  }

  async patchUserCoordinates(userId: string, localisation: PatchUserDto) {
    const res = await userRepository.patchUserCoordinates(userId, localisation);
    const user: CreateUserDto = res.rows[0];
    if (user) {
      user.password = '';
    }
    return user;
  }

  async patchUserAgePreferences(userId: number, min: number, max: number) {
    const res = await userRepository.patchUserAgePreferences(userId, min, max);
    return res.rowCount;
  }

  async patchUserDistancePreferences(userId: number, distance: number) {
    const res = await userRepository.patchUserDistancePreferences(
      userId,
      distance
    );

    return res.rowCount;
  }

  async increaseUserPopularity(userId: number) {
    const user = await this.getById(userId.toString());
    let popularity = 1;
    if (user.popularity) {
      popularity += user.popularity;
    }
    const res = await userRepository.increaseUserPopularity(userId, popularity);
    return res.rowCount;
  }

  async decreaseUserPopularity(userId: number) {
    const user = await this.getById(userId.toString());
    let popularity = 0;
    if (user.popularity) {
      popularity += user.popularity - 1;
    }
    const res = await userRepository.decreaseUserPopularity(userId, popularity);
    return res.rowCount;
  }

  async status(userId: number, status: number) {
    await userRepository.status(userId, status);
  }
}

export default new UserService();
