import bcrypt from 'bcrypt';
import { CRUD } from '../common/interfaces/crud.interface';
import { CreateUserDto } from '../dto/users/create.user.dto';
import { PatchUserDto } from '../dto/users/patch.user.dto';
import { MapUserMatchesDto } from '../dto/users/match.user.dto';
import userRepository from '../repositories/user.repository';
import { SALT_ROUNDS } from '../config/const';

enum SexualOrientation {
  Straight = 'straight',
  Bisexual = 'bisexual',
  Gay = 'gay',
}

class UserService implements CRUD {
  async create(resource: CreateUserDto) {
    resource.password = await bcrypt.hash(resource.password, SALT_ROUNDS);
    const res = await userRepository.addUser(resource);
    const user: CreateUserDto = res.rows[0];

    if (user) {
      user.password = '';
    }
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
    //SELECT *, file_path FROM users JOIN pictures ON users.id = user_id;
    if (user.gender === 'female') {
      switch (user.sexual_orientation) {
        case SexualOrientation.Straight:
          query = `SELECT * FROM users WHERE gender='male'`;
          break;
        case SexualOrientation.Gay:
          query = `SELECT *, file_path FROM users WHERE gender='female'`;
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
          query = `SELECT *, file_path FROM users WHERE gender='male'`;
          break;
        default:
          query = `SELECT * FROM users`;
          break;
      }
    }
    const res = await userRepository.match(query);
    const rawUsers: CreateUserDto[] = res.rows;
    let matches: CreateUserDto[] = [];
    if (user.gender === 'female') {
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
              (user.gender === 'male' &&
                user.sexual_orientation !== SexualOrientation.Gay) ||
              (user.gender === 'female' &&
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
              (user.gender === 'female' &&
                user.sexual_orientation !== SexualOrientation.Gay) ||
              (user.gender === 'male' &&
                user.sexual_orientation !== SexualOrientation.Straight)
          );
          break;
      }
    }
    return await MapUserMatchesDto(requester, matches);
  }

  async getById(id: string) {
    const res = await userRepository.getUserById(id);

    console.log(`getById(${res.rows[0]?.id})`);

    return res.rows[0] as CreateUserDto;
  }

  async getUserByEmail(email: string) {
    const res = await userRepository.getUserByEmail(email);

    console.log(`getUserByEmail(${res.rows[0]?.email})`);

    return res.rows[0] as CreateUserDto;
  }

  async getUserByUsername(username: string) {
    const res = await userRepository.getUserByUsername(username);
    console.log(`getUserByUsername(${res.rows[0]?.username})`);

    return res.rows[0] as CreateUserDto;
  }

  async getUserWithoutPassword(username: string) {
    const res = await userRepository.getUserWithoutPassword(username);

    return res.rows[0] as CreateUserDto;
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
}

export default new UserService();
