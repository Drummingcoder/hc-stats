import { goplay } from './deathstart.js';
import { dereply } from './deathrep.js';

export const register = (app) => {
  app.view('death_go_modal', goplay);
  app.view('death_respond_modal', dereply);
};
