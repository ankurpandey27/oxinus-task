export const PORT: number = +process.env.PORT;
export const DATABASE_URL = process.env.DATABASE_URL;

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN_DAYS = +process.env.JWT_EXPIRES_IN_DAYS;

//password
export const MIN_PASSWORD_LENGTH = +process.env.MIN_PASSWORD_LENGTH;
export const MAX_PASSWORD_LENGTH = +process.env.MAX_PASSWORD_LENGTH;
