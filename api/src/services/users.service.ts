import bcrypt from 'bcrypt';
import { CRUD } from '../common/interfaces/crud.interface';
import { CreateUserDto } from '../dto/users/create.user.dto';
import { PublicUserDto } from '../dto/users/public.user.dto';
import { PutUserDto } from '../dto/users/put.user.dto';
import { PatchUserDto } from '../dto/users/patch.user.dto';
import userRepository from '../repositories/user.repository';
import { SALT_ROUNDS } from '../config/const';

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
}

export default new UserService();
