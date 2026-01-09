import { App, LogLevel } from '@slack/bolt';
import 'dotenv/config';
import registerListeners from './listeners/index.ts';
import http from 'http';
import cron from 'node-cron';
import { DateTime } from 'luxon';
import events from './listeners/events/index.ts';

const { dbAll, dbRun } = events;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

// Run every hour at minute 0, but only execute at midnight America/Los_Angeles (handles DST)
cron.schedule('0 * * * *', async () => {
  const now = DateTime.now().setZone('America/Los_Angeles');
  if (now.hour !== 0) return;
  console.log('Running scheduled midnight report...');
  
  const privChannel = 'C09TXAZ8GAG'; 
  const pubChannel = 'C09UH2LCP1Q';

  const allRecords = await dbAll('SELECT * FROM Data') as any[];
  const recordMap = Object.fromEntries(
    allRecords.map(r => [r.Field, r])
  );
  await app.client.chat.postMessage({
    channel: privChannel,
    text: `Yesterday: \n
    New users joined: ${recordMap["New User"]?.Number ?? 0}\n
    New bots joined: ${recordMap["New Bot"]?.Number ?? 0}\n
    New workflows made: ${recordMap["New Workflow Bot"]?.Number ?? 0}\n
    Channels created: ${recordMap["Channel Created"]?.Number ?? 0}\n
    Channels archived: ${recordMap["Channel Archived"]?.Number ?? 0}\n
    Channels deleted: ${recordMap["Channel Deleted"]?.Number ?? 0}\n
    Channels unarchived: ${recordMap["Channel Unarchived"]?.Number ?? 0}\n
    Channels renamed: ${recordMap["Channel Renamed"]?.Number ?? 0}\n
    User groups added: ${recordMap["Subteam Added"]?.Number ?? 0}\n
    User groups edited: ${recordMap["Subteam Changed"]?.Number ?? 0} with ${recordMap["Subteam Members Changed"]?.Number ?? 0} of those edits being member changes\n
    User groups deleted: ${recordMap["Subteam Deleted"]?.Number ?? 0}\n
    Emojis added: ${recordMap["Emoji Added"]?.Number ?? 0}\n
    Emoji alias added: ${recordMap["Emoji Alias Added"]?.Number ?? 0}\n
    Emojis changed: ${recordMap["Emoji Changed"]?.Number ?? 0}\n
    Emojis deleted: ${recordMap["Emoji Removed"]?.Number ?? 0}\n
    Number of times Do Not Disturb was turned on: ${recordMap["Dnd Set Active"]?.Number ?? 0}\n
    Number of times Do Not Disturb was turned off: ${recordMap["Dnd Set Inactive"]?.Number ?? 0}\n
    Number of times a huddle was joined: ${recordMap["Huddle Joined"]?.Number ?? 0}\n
    Number of times a huddle was left: ${recordMap["Huddle Left"]?.Number ?? 0}\n
    `,
  });
  await app.client.chat.postMessage({
    channel: pubChannel,
    text: `Yesterday: \n
    New users joined: ${recordMap["New User"]?.Number ?? 0}\n
    New bots joined: ${recordMap["New Bot"]?.Number ?? 0}\n
    New workflows made: ${recordMap["New Workflow Bot"]?.Number ?? 0}\n
    Channels created: ${recordMap["Channel Created"]?.Number ?? 0}\n
    Channels archived: ${recordMap["Channel Archived"]?.Number ?? 0}\n
    Channels deleted: ${recordMap["Channel Deleted"]?.Number ?? 0}\n
    Channels unarchived: ${recordMap["Channel Unarchived"]?.Number ?? 0}\n
    Channels renamed: ${recordMap["Channel Renamed"]?.Number ?? 0}\n
    User groups added: ${recordMap["Subteam Added"]?.Number ?? 0}\n
    User groups edited: ${recordMap["Subteam Changed"]?.Number ?? 0} with ${recordMap["Subteam Members Changed"]?.Number ?? 0} of those edits being member changes\n
    User groups deleted: ${recordMap["Subteam Deleted"]?.Number ?? 0}\n
    Emojis added: ${recordMap["Emoji Added"]?.Number ?? 0}\n
    Emoji alias added: ${recordMap["Emoji Alias Added"]?.Number ?? 0}\n
    Emojis changed: ${recordMap["Emoji Changed"]?.Number ?? 0}\n
    Emojis deleted: ${recordMap["Emoji Removed"]?.Number ?? 0}\n
    Number of times Do Not Disturb was turned on: ${recordMap["Dnd Set Active"]?.Number ?? 0}\n
    Number of times Do Not Disturb was turned off: ${recordMap["Dnd Set Inactive"]?.Number ?? 0}\n
    Number of times a huddle was joined: ${recordMap["Huddle Joined"]?.Number ?? 0}\n
    Number of times a huddle was left: ${recordMap["Huddle Left"]?.Number ?? 0}\n
    `,
  });
  
  const rep1 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `New users for today: `,
  });
  const rep2 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `New bots for today: `,
  });
  const rep100 = await app.client.chat.postMessage({
    channel: pubChannel,
    text: `New bots for today: `,
  });
  const rep3 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Channels created: `,
  });
  const rep99 = await app.client.chat.postMessage({
    channel: pubChannel,
    text: `Channels created: `,
  });
  const rep4 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Channels archived: `,
  });
  const rep98 = await app.client.chat.postMessage({
    channel: pubChannel,
    text: `Channels archived: `,
  });
  const rep5 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Channels deleted: `,
  });
  const rep97 = await app.client.chat.postMessage({
    channel: pubChannel,
    text: `Channels deleted: `,
  });
  const rep6 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Channels unarchived: `,
  });
  const rep96 = await app.client.chat.postMessage({
    channel: pubChannel,
    text: `Channels unarchived: `,
  });
  const rep7 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Channels renamed: `,
  });
  const rep95 = await app.client.chat.postMessage({
    channel: pubChannel,
    text: `Channels renamed: `,
  });
  const rep8 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `User groups added: `,
  });
  const rep9 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `User groups modified: `,
  });
  const rep10 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `User groups deleted: `,
  });
  const rep11 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Emojis added: `,
  });
  const rep94 = await app.client.chat.postMessage({
    channel: pubChannel,
    text: `Emojis added: `,
  });
  const rep16 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Emoji aliases added: `,
  });
  const rep93 = await app.client.chat.postMessage({
    channel: pubChannel,
    text: `Emoji aliases added: `,
  });
  const rep12 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Emojis edited: `,
  });
  const rep92 = await app.client.chat.postMessage({
    channel: pubChannel,
    text: `Emojis edited: `,
  });
  const rep13 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Emojis removed: `,
  });
  const rep91 = await app.client.chat.postMessage({
    channel: pubChannel,
    text: `Emojis removed: `,
  });
  const rep14 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Do Not Disturb set to true: `,
  });
  const rep15 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Do Not Disturb set to false: `,
  });
  const rep17 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Huddle joiners: `,
  });
  const rep18 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Huddle leavers: `,
  });
  const airtablePayload = [
    {
      fields: { 
        "Field": "New User", 
        "Messagets": rep1.ts,
        "Number": 0
      }
    },
    {
      fields: { 
        "Field": "New Bot", 
        "Messagets": rep2.ts,
        "Number": 0,
        "PubMes": rep100.ts,
      }
    },
    {
      fields: { 
        "Field": "New Workflow Bot", 
        "Messagets": rep2.ts,
        "Number": 0,
        "PubMes": rep100.ts,
      }
    }, 
    {
      fields: { 
        "Field": "Channel Created", 
        "Messagets": rep3.ts,
        "Number": 0,
        "PubMes": rep99.ts,
      }
    },
    {
      fields: { 
        "Field": "Channel Archived", 
        "Messagets": rep4.ts,
        "Number": 0,
        "PubMes": rep98.ts,
      }
    }, 
    {
      fields: { 
        "Field": "Channel Deleted", 
        "Messagets": rep5.ts,
        "Number": 0,
        "PubMes": rep97.ts,
      }
    }, 
    {
      fields: { 
        "Field": "Channel Unarchived", 
        "Messagets": rep6.ts,
        "Number": 0, 
        "PubMes": rep96.ts,
      }
    },
    {
      fields: { 
        "Field": "Channel Renamed", 
        "Messagets": rep7.ts,
        "Number": 0,
        "PubMes": rep95.ts,
      }
    },
    {
      fields: { 
        "Field": "Subteam Added", 
        "Messagets": rep8.ts,
        "Number": 0
      }
    },
    {
      fields: { 
        "Field": "Subteam Members Changed", 
        "Messagets": rep9.ts,
        "Number": 0
      }
    },
    {
      fields: { 
        "Field": "Subteam Changed", 
        "Messagets": rep9.ts,
        "Number": 0
      }
    },
    {
      fields: { 
        "Field": "Subteam Deleted", 
        "Messagets": rep10.ts,
        "Number": 0
      }
    },
    {
      fields: { 
        "Field": "Emoji Added", 
        "Messagets": rep11.ts,
        "Number": 0,
        "PubMes": rep94.ts,
      }
    },
    {
      fields: { 
        "Field": "Emoji Changed", 
        "Messagets": rep12.ts,
        "Number": 0,
        "PubMes": rep92.ts,
      }
    },
    {
      fields: { 
        "Field": "Emoji Removed", 
        "Messagets": rep13.ts,
        "Number": 0,
        "PubMes": rep91.ts,
      }
    },
    {
      fields: { 
        "Field": "Dnd Set Active", 
        "Messagets": rep14.ts,
        "Number": 0,
      }
    },
    {
      fields: { 
        "Field": "Dnd Set Inactive", 
        "Messagets": rep15.ts,
        "Number": 0
      }
    },
    {
      fields: { 
        "Field": "Emoji Alias Added", 
        "Messagets": rep16.ts,
        "Number": 0,
        "PubMes": rep93.ts,
      }
    },
    {
      fields: { 
        "Field": "Huddle Joined", 
        "Messagets": rep17.ts,
        "Number": 0
      }
    },
    {
      fields: { 
        "Field": "Huddle Left", 
        "Messagets": rep18.ts,
        "Number": 0
      }
    }
  ];
  for (const payload of airtablePayload) {
    await dbRun(
      'UPDATE Data SET Messagets = ?, Number = ?, PubMes = ? WHERE Field = ?',
      payload.fields.Messagets,
      payload.fields.Number,
      payload.fields.PubMes ?? null,
      payload.fields.Field
    );
  }
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
