import { deathb } from './deathbyai.js';
import { derespond } from './deathresponder.js';

export const register = (app) => {
  app.command('/deathbyai', deathb);
  app.command('/deathrespond', derespond);
};
