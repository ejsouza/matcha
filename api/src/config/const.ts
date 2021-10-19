// const SECRET_TOKEN = 'thisIsASecreatToken';
const SALT_ROUNDS = 10;
const EXPIRES_IN = 36000;
const SECRET_TOKEN = process.env.JWT_SECRET || '';

export { SECRET_TOKEN, SALT_ROUNDS, EXPIRES_IN };
