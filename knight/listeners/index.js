import * as actions from './actions/index.js';
import * as commands from './commands/index.js';
import * as events from './events/index.js';
import * as messages from './messages/index.js';
import * as shortcuts from './shortcuts/index.js';
import * as views from './views/index.js';

console.log('listeners: module loaded');

export const registerListeners = (app) => {
  console.log('listeners: registerListeners called');
  actions.register(app);
  commands.register(app);
  events.register(app);
  messages.register(app);
  shortcuts.register(app);
  views.register(app);
};
