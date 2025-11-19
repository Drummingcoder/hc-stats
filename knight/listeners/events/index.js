import { appHomeOpenedCallback } from './app-home-opened.js';
import { userjoin } from './user-join.js';
import { textback } from './reset.js';

console.log('listeners/events: module loaded');

export const register = (app) => {
  /*app.event('app_home_opened', appHomeOpenedCallback);*/
  /*app.event('team_join', userjoin);*/
  app.message(({ message }) => message?.subtype !== 'bot_message', textback);
};
