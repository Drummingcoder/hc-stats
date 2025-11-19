import type { App } from '@slack/bolt';
const Airtable = require('airtable');

const register = (app: App) => {
  app.event('message', async ({ event, client, logger }) => {
    try {
      const msg = event as any;
      if (msg.text == "time to run and go") {
        await client.chat.postMessage({
          channel: msg.channel,
          text: `Thanks for your message, <@${msg.user}>! I saw: ${msg.text}`,
          thread_ts: msg.ts,
        }); 
      }
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });
};

export default { register };
