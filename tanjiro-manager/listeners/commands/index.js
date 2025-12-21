import { deathb } from './deathbyai.js';

export const register = (app) => {
  app.command('/deathbyai', deathb);
};
