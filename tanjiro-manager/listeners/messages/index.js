import { addperson } from './deathadder.js';

export const register = (app) => {
  app.message(/^(me|Me|I|i).*/, addperson);
};
