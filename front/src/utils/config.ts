import * as dotenv from 'dotenv';

dotenv.config();

console.log(process.env.REACT_APP_API_URL);
export const API_BASE_URL = process.env.REACT_APP_API_URL ?? '';

export const PORT = process.env.REACT_APP_PORT ?? '';
