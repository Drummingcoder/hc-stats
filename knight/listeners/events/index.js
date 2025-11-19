import { appHomeOpenedCallback } from './app-home-opened.js';
import { userjoin } from './user-join.js';
import { textback } from './reset.js';

console.log('listeners/events: module loaded');

export const register = (app) => {
  /*app.event('app_home_opened', appHomeOpenedCallback);*/
  /*app.event('team_join', userjoin);*/
  app.event('app_mention', async ({ event, logger, client }) => {
    logger?.info?.('app_mention received', { text: event?.text, channel: event?.channel, user: event?.user });
    // optional: acknowledge visibly
    await client.chat.postMessage({ channel: event.channel, text: `got mention from <@${event.user}>` });
  });
  app.event('message', async ({ event, logger }) => {
    logger?.info?.('raw message event', { type: event?.type, subtype: event?.subtype, channel: event?.channel, user: event?.user, text: event?.text?.slice?.(0,200) });
  });
};
