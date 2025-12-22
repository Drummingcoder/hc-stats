import { goplay } from './deathstart.js';
import { dereply } from './deathrep.js';
import { basicrps } from './regrps.js';
import { p1MoveSubmission, p2MoveSubmission } from './rps-submissions.js';

export const register = (app) => {
  app.view('death_go_modal', goplay);
  app.view('death_respond_modal', dereply);
  app.view('rps_start_modal', basicrps);
  app.view('p1_inpu', p1MoveSubmission);
  app.view('p2_inpu', p2MoveSubmission);
};
