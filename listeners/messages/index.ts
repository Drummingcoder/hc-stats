import type { App } from '@slack/bolt';
import { sampleMessageCallback } from './sample-message.ts';
import eventsModule from '../events/index.ts';

const { turso, dbRun, dbGet, dbAll, messandstore, publicMessage, privChannel, pubChannel } = eventsModule;

const register = (app: App) => {
  // app.message(/^(hi|hello|hey).*/, sampleMessageCallback);

  app.message(async ({ message, client, logger }) => {  
    /*if (message.subtype == 'channel_convert_to_public') {
      await messandstore(client, 'Channel Made Public', `Channel <#${message.channel}> (id: ${message.channel}) is made public by <@${message.user}>.`, privChannel, logger);
      //publicMessage(client, 'Channel Made Public', `Channel <#${message.channel}> (id: ${message.channel}) is made public by <@${message.user}>.`, pubChannel, logger);
    } else if (message.subtype == 'channel_convert_to_private') { 
      await messandstore(client, 'Channel Made Private', `Channel <#${message.channel}> (id: ${message.channel}) is made private by <@${message.user}>.`, privChannel, logger);
      //publicMessage(client, 'Channel Made Private', `Channel <#${message.channel}> (id: ${message.channel}) is now private by <@${message.user}>.`, pubChannel, logger);
    }*/
  });
};

export default { register };
