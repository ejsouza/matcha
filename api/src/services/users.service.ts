import db from '../../db';
import { CRUD } from '../common/interfaces/crud.interface';
import { CreateUserDto } from '../dto/users/create.user.dto';
import { PutUserDto } from '../dto/users/put.user.dto';
import { PatchUserDto } from '../dto/users/patch.user.dto';
import UserRepository from '../repositories/user.repository';

class UserService implements CRUD {
  async create(resource: CreateUserDto) {
    return UserRepository.addUser(resource);
  }

  async deleteUser(id: string) {
    return UserRepository.deleteUser(id);
  }

  async list(limit: number, page: number) {
    return UserRepository.getUsers();
  }

  async getById(id: string) {
    return UserRepository.getUserById(id);
  }

  async patchById(id: string, resource: PatchUserDto) {
    return UserRepository.patchUser(id, resource);
  }
}

export default new UserService();
