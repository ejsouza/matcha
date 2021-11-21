import db from '../../db';
import { CreateUserDto } from '../dto/users/create.user.dto';
import { PatchUserDto } from '../dto/users/patch.user.dto';
import debug from 'debug';

const log: debug.IDebugger = debug('app:User-repository');

class UserRepository {
  constructor() {
    log('Created new instance of User');
  }

  async addUser(user: CreateUserDto) {
    const { username, firstname, lastname, email, password } = user;
    const query =
      'INSERT INTO users(username, firstname, lastname, email, password, sexual_orientation) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    return db.query(query, [
      username,
      firstname,
      lastname,
      email,
      password,
      'bisexual',
    ]);
  }

  async getUsers() {
    const query = 'SELECT * FROM users';
    return db.query(query, []);
  }

  async match(query: string) {
    return db.query(query, []);
  }

  async getUserById(userId: string) {
    const query = 'SELECT * FROM users WHERE id = $1';
    return db.query(query, [userId]);
  }

  async getUserByEmail(email: string) {
    const query = 'SELECT * FROM users WHERE email = $1';
    return db.query(query, [email]);
  }

  async getUserByUsername(username: string) {
    const query = `SELECT * FROM users WHERE username = $1`;
    return db.query(query, [username]);
  }

  async getUserWithoutPassword(username: string) {
    const query = `SELECT 
      u.id,
      u.username,
      u.firstname,
      u.lastname,
      u.email,
      u.gender,
      u.birthdate,
      u.sexual_orientation,
      u.biography,
      u.localisation,
      u.activated,
      u.created_at,
      u.updated_at
      FROM users u
      WHERE username = $1
    `;

    return db.query(query, [username]);
  }

  async updateLastSeen(userId: number) {
    const date = new Date();
    const query = 'UPDATE users SET updated_at = $2 WHERE id = $1';

    return db.query(query, [userId, date]);
  }

  async patchUser(userId: string, user: PatchUserDto) {
    let prepare = ['UPDATE users'];
    prepare.push('SET');
    let set: string[];
    set = [];
    Object.keys(user).forEach((key, i) => {
      if (key !== 'id') {
        set.push(`${key} = ($${i + 1})`);
      }
    });
    prepare.push(set.join(', '));
    prepare.push(`WHERE id = ${userId} RETURNING *`);

    const values = Object.values(user).map((value) => value);
    /**
     * [Remove id from from array]
     * We always add the user id to the body in:
     * users.routes.confi.ts
     * this way we have access to it anywhere in the app
     * if the ressources requires user id.
     */
    values.pop();
    const query = prepare.join(' ');
    return db.query(query, values);
  }

  async patchUserCoordinates(userId: string, coordinates: PatchUserDto) {
    const query = `UPDATE users SET localisation=POINT($1, $2) WHERE id=$3 RETURNING *`;

    console.log(
      `userRepository patchUserCoordinates(${coordinates.localisation?.x}, ${coordinates.localisation?.y})`
    );
    const values = [
      coordinates.localisation?.x,
      coordinates.localisation?.y,
      userId,
    ];

    return db.query(query, values);
  }

  async patchUserAgePreferences(userId: number, min: number, max: number) {
    const query =
      'UPDATE users SET age_preference_min = $2, age_preference_max = $3  WHERE id = $1';

    return db.query(query, [userId, min, max]);
  }

  async patchUserDistancePreferences(userId: number, distance: number) {
    const query = 'UPDATE users SET distance_preference=$2 WHERE id = $1';

    return db.query(query, [userId, distance]);
  }

  async increaseUserPopularity(userId: number, popularity: number) {
    const query = 'UPDATE users SET popularity=$1 WHERE id=$2';
    return db.query(query, [popularity, userId]);
  }

  async decreaseUserPopularity(userId: number, popularity: number) {
    const query = 'UPDATE users SET popularity=$1 WHERE id=$2';
    return db.query(query, [popularity, userId]);
  }

  async status(userId: number, status: number) {
    const query = 'UPDATE users SET is_connected=$1 WHERE id=$2';
    return db.query(query, [status, userId]);
  }

  async updateUserAccountActiveState(userId: number, status: boolean) {
    const query = 'UPDATE users SET activated=$2 WHERE id=$1';

    return db.query(query, [userId, status]);
  }

  async resetPassword(userId: number, password: string) {
    const query = 'UPDATE users SET password=$2 WHERE id=$1';

    return db.query(query, [userId, password]);
  }

  async deleteUser(userId: string) {
    return `${userId} deleted`;
  }
}

export default new UserRepository();
