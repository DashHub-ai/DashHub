import { genRandomToken } from '~/helpers';

export const generateRefreshToken = () => genRandomToken(24);
