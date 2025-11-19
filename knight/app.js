import { App, LogLevel } from '@slack/bolt';
import { config } from 'dotenv';
import { registerListeners } from './listeners/index.js';

config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

app.message('hi', async ({ message, say }) => {
  if (message.subtype === undefined
    || message.subtype === 'bot_message'
    || message.subtype === 'file_share'
    || message.subtype === 'thread_broadcast') {
    await say(`Hello, <@${message.user}>`);
  }
});

registerListeners(app);

(async () => {
  try {
    await app.start();
    app.logger.info('Knight app is running!');
  } catch (error) {
    app.logger.error('Failed to start the app', error);
  }
})();
