import { App, FileInstallationStore, LogLevel } from '@slack/bolt';
import { config } from 'dotenv';
import { registerListeners } from './listeners/index.js';

config();

const app = new App({
  logLevel: LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  scopes: ['channels:history', 'chat:write', 'commands', "channels:read","groups:read","emoji:read","files:read","group:read","groups:history","im:history","mpim:history","usergroups:read","users:read"],
  installationStore: new FileInstallationStore(),
  installerOptions: {
    directInstall: false,
  },
});

registerListeners(app);

(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    app.logger.info('Knight app is running!');
  } catch (error) {
    app.logger.error('Unable to start App', error);
  }
})();
