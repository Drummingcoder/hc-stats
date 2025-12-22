import { App, LogLevel } from '@slack/bolt';
import 'dotenv/config';
import registerListeners from './listeners/index.ts';
import http from 'http';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

registerListeners(app);

(async () => {
  await app.start();
  console.log('⚡️ Snooper knight is running in Socket Mode!');

  // KOYEB HEALTH CHECK SERVER
  // This satisfies Koyeb that the app is "Live"
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('All systems go');
  }).listen(process.env.PORT || 8000);
})();
