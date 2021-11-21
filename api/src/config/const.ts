const SALT_ROUNDS = 10;
const EXPIRES_IN = 36000;
const SECRET_TOKEN = process.env.JWT_SECRET || '';
const KM = 1000;

const PASS_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export { SECRET_TOKEN, SALT_ROUNDS, EXPIRES_IN, KM, PASS_REGEX, EMAIL_REGEX };
