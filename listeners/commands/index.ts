import type { App } from '@slack/bolt';
import { sampleCommandCallback } from './sample-command.ts';

const register = (app: App) => {
  app.command('/pingfest-join', sampleCommandCallback);
};

export default { register };
