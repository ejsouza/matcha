import db from '../../db';
import { CreateUserDto } from '../dto/users/create.user.dto';
import { PatchUserDto } from '../dto/users/patch.user.dto';
import { PutUserDto } from '../dto/users/put.user.dto';
import debug from 'debug';

const log: debug.IDebugger = debug('app:User-repository');

class UserRepository {
  constructor() {
    log('Created new instance of User');
  }

  async addUser(user: CreateUserDto) {
    const { username, first_name, last_name, email, password } = user;
    const query =
      'INSERT INTO users(username, first_name, last_name, email, password) VALUES($1, $2, $3, $4, $5)';
    return db.query(query, [username, first_name, last_name, email, password]);
  }

  async getUsers() {
    const query = 'SELECT * FROM users';
    return db.query(query, []);
  }

  async getUserById(userId: string) {}

  async patchUser(userId: string, user: PatchUserDto) {
    return `${user.id} patched`;
  }

  async deleteUser(userId: string) {
    return `${userId} deleted`;
  }
}

export default new UserRepository();
