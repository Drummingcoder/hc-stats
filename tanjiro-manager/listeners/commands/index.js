import { deathb } from './deathbyai.js';
import { derespond } from './deathresponder.js';
import { play } from './regularrps.js';

export const register = (app) => {
  app.command('/deathbyai', deathb);
  app.command('/deathrespond', derespond);
  app.command('/playRPS', play);
};
