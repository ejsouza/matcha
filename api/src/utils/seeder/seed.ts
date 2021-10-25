import db from '../../../db/index';
import faker from 'faker';
import bcrypt from 'bcrypt';
import tagService from '../../services/tags.service';
import { CreateTagDto } from '../../dto/tags/create.tag.dto';
import { SALT_ROUNDS } from '../../config/const';
import { setLocation } from '../../utils/seeder/fake_location';
import baseTags from '../../config/base.tags';
import https from 'https';

faker.locale = 'fr';

const randTags = async (userId: number) => {
  let base = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28,
  ];

  let random: number[] = [];

  while (random.length < 3) {
    random.push(base.splice(Math.floor(Math.random() * base.length), 1)[0]);
  }

  for (let x = 0; x < random.length; x++) {
    const tag: CreateTagDto = {
      id: baseTags[random[x]].id,
      name: baseTags[random[x]].name,
      user_id: userId,
    };
    await tagService.create(tag);
  }

  // return random;
};

const createUserAccount = async () => {
  for (let i = 1; i <= 100; i++) {
    const genders = ['male', 'female'];
    const sexuality = ['straight', 'gay', 'bisexual'];
    let coordinates = {
      x: 0,
      y: 0,
    };
    if (i <= 150) {
      coordinates = setLocation(
        47.21400394584991,
        47.255665492438254,
        -1.5523838481265795,
        -1.5843600124770751
      ); // Nantes area coordinates
    } else if (i <= 300) {
      coordinates = setLocation(
        45.74030656088014,
        45.77461914951937,
        4.844878073170973,
        4.883473249455159
      ); // Lyon area coordinates
    } else {
      coordinates = setLocation(
        48.82985637372646,
        48.89373720829586,
        2.2851965731168455,
        2.3904911392024575
      ); // Paris area coordinates
    }

    const created_at = faker.date.past(
      Math.floor(Math.random() * (30 - 5) + 5)
    );
    const birthdate = faker.date.between('1980-01-01', '2002-12-31');
    const gender = faker.random.arrayElement(genders); //7
    const firstname = faker.name.firstName(genders.indexOf(gender)); //2
    const lastname = faker.name.lastName(); //3
    const username = faker.internet.userName(firstname); //1
    const email = faker.internet.email(`${firstname} ${lastname}`); //4
    const biography = faker.lorem.sentence(10, 10); //8
    const clearPassword = faker.internet.password(); //x
    const password = await bcrypt.hash(clearPassword, SALT_ROUNDS); //5
    const sexual_orientation = faker.random.arrayElement(sexuality); //6
    const activated = true; //9
    const is_connected = Math.floor(Math.random() * 2); //14
    const popularity = Math.floor(Math.random() * 10); //15

    const query = `INSERT INTO users(
			username,
			firstname,
			lastname,
			email,
			password,
			sexual_orientation,
			gender,
			biography,
			activated,
			localisation,
			created_at,
			birthdate,
      is_connected,
      popularity
			)
			VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, POINT($10, $11), $12, $13, $14, $15)`;

    await db.query(query, [
      username,
      firstname,
      lastname,
      email,
      password,
      sexual_orientation,
      gender,
      biography,
      activated,
      coordinates.x,
      coordinates.y,
      created_at,
      birthdate,
      is_connected,
      popularity,
    ]);
    console.log(`creating user ${username} gender ${gender} number ${i}...`);

    https.get(
      `https://fakeface.rest/face/json?gender=${gender}&minimum_age=18&maximum_age=30`,
      (res) => {
        let body = '';
        res.on('data', (d) => {
          body += d;
        });
        res.on('end', async () => {
          const fake = JSON.parse(body);
          const path = fake.image_url;
          const picture_query =
            'INSERT INTO pictures(user_id, file_path) VALUES($1, $2)';
          const default_picture_query =
            'UPDATE users SET default_picture=$1 WHERE id=$2';
          await db.query(picture_query, [i, path]);
          await db.query(default_picture_query, [path, i]);
        });
      }
    );

    randTags(i);

    setTimeout(() => {}, 100);
  }
};

createUserAccount();
