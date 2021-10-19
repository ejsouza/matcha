import { Pool, QueryArrayConfig, PoolClient } from 'pg';
import path from 'path';
import { migrate } from 'postgres-migrations';
import faker from 'faker';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../src/config/const';
import { setLocation } from '../src/utils/seeder/fake_location';

faker.locale = 'fr';
const poolConfig = {
  database: process.env.DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  max: Number(process.env.DB_POOL_SIZE),
  idleTimeoutMillis: Number(process.env.DB_POOL_CLIENT_IDLE_TIMEOUT),
  connectionTimeoutMillis: Number(
    process.env.DB_POOL_CLIENT_CONNECTION_TIMEOUT
  ),
};

const pool = new Pool(poolConfig);

const db = {
  query: async function (text: string, params: any) {
    const res = await pool.query(text, params);
    return res;
  },
  // seed: async function (count: number) {
  //   const genders = ['male', 'female'];
  //   const sexuality = ['straight', 'gay', 'bisexual'];
  //   let longitude = {
  //     x: 0,
  //     y: 0,
  //   };
  //   if (count <= 150) {
  //     longitude = setLocation(
  //       47.21400394584991,
  //       47.255665492438254,
  //       -1.5523838481265795,
  //       -1.5843600124770751
  //     ); // Nantes area coordinates
  //   } else if (count <= 300) {
  //     longitude = setLocation(
  //       45.74030656088014,
  //       45.77461914951937,
  //       4.844878073170973,
  //       4.883473249455159
  //     ); // Lyon area coordinates
  //   } else {
  //     longitude = setLocation(
  //       48.82985637372646,
  //       48.89373720829586,
  //       2.2851965731168455,
  //       2.3904911392024575
  //     ); // Paris area coordinates
  //   }

  //   const created_at = faker.date.past(
  //     Math.floor(Math.random() * (30 - 5) + 5)
  //   );
  //   const updated_at = faker.date.between(created_at, new Date());
  //   const firstname = faker.name.firstName(); //2
  //   const lastname = faker.name.lastName(); //3
  //   const username = faker.internet.userName(firstname); //1
  //   const email = faker.internet.email(firstname); //4
  //   const biography = faker.lorem.sentences(16); //8
  //   const clearPassword = faker.internet.password(); //x
  //   const password = await bcrypt.hash(clearPassword, SALT_ROUNDS); //5
  //   const gender = faker.random.arrayElement(genders); //7
  //   const sexual_orientation = faker.random.arrayElement(sexuality); //6
  //   const activated = true; //9

  //   await  this.query(
  //     `INSERT INTO users(
  //       username,
  //       firstname,
  //       lastname,
  //       email,
  //       password,
  //       sexual_orientation,
  //       gender,
  //       biography,
  //       activated,
  //       )
  //       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
  //     [
  //       username,
  //       firstname,
  //       lastname,
  //       email,
  //       password,
  //       sexual_orientation,
  //       gender,
  //       biography,
  //       activated,
  //     ]
  //   );
  // },
};

export default db;
