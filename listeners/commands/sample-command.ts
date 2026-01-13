import type { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import events from '../events/index.ts';

const { dbAll, dbRun } = events;

const sampleCommandCallback = async ({ ack, logger, client, command }: AllMiddlewareArgs & SlackCommandMiddlewareArgs) => {
  try {
    await ack();

    if (command.user_id != "U091EPSQ3E3") {
      return;
    }
    
    const privChannel = 'C09TXAZ8GAG'; 
    const pubChannel = 'C09UH2LCP1Q';

    const allRecords = await dbAll('SELECT * FROM Data') as any[];
    const recordMap = Object.fromEntries(
      allRecords.map(r => [r.Field, r])
    );
    await client.chat.postMessage({
      channel: privChannel,
      text: `Yesterday: \n
      New users joined: ${recordMap["New User"]?.Number ?? 0}\n
      New bots joined: ${recordMap["New Bot"]?.Number ?? 0}\n
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
      Files created: ${recordMap["File Created"]?.Number ?? 0}\n
      Files shared: ${recordMap["File Shared"]?.Number ?? 0}\n
      Files changed: ${recordMap["File Changed"]?.Number ?? 0}\n
      Files deleted: ${recordMap["File Deleted"]?.Number ?? 0}\n
      Files made public: ${recordMap["File Public"]?.Number ?? 0}\n
      Files unshared: ${recordMap["File Unshared"]?.Number ?? 0}\n
      `,
    });
    await client.chat.postMessage({
      channel: pubChannel,
      text: `Yesterday: \n
      New users joined: ${recordMap["New User"]?.Number ?? 0}\n
      New bots joined: ${recordMap["New Bot"]?.Number ?? 0}\n
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
      Files created: ${recordMap["File Created"]?.Number ?? 0}\n
      Files shared: ${recordMap["File Shared"]?.Number ?? 0}\n
      Files changed: ${recordMap["File Changed"]?.Number ?? 0}\n
      Files deleted: ${recordMap["File Deleted"]?.Number ?? 0}\n
      Files made public: ${recordMap["File Public"]?.Number ?? 0}\n
      Files unshared: ${recordMap["File Unshared"]?.Number ?? 0}\n
      `,
    });
    
    const rep1 = await client.chat.postMessage({
      channel: privChannel,
      text: `New users for today: `,
    });
    const rep2 = await client.chat.postMessage({
      channel: privChannel,
      text: `New bots for today: `,
    });
    const rep100 = await client.chat.postMessage({
      channel: pubChannel,
      text: `New bots for today: `,
    });
    const rep3 = await client.chat.postMessage({
      channel: privChannel,
      text: `Channels created: `,
    });
    const rep99 = await client.chat.postMessage({
      channel: pubChannel,
      text: `Channels created: `,
    });
    const rep4 = await client.chat.postMessage({
      channel: privChannel,
      text: `Channels archived: `,
    });
    const rep98 = await client.chat.postMessage({
      channel: pubChannel,
      text: `Channels archived: `,
    });
    const rep5 = await client.chat.postMessage({
      channel: privChannel,
      text: `Channels deleted: `,
    });
    const rep97 = await client.chat.postMessage({
      channel: pubChannel,
      text: `Channels deleted: `,
    });
    const rep6 = await client.chat.postMessage({
      channel: privChannel,
      text: `Channels unarchived: `,
    });
    const rep96 = await client.chat.postMessage({
      channel: pubChannel,
      text: `Channels unarchived: `,
    });
    const rep7 = await client.chat.postMessage({
      channel: privChannel,
      text: `Channels renamed: `,
    });
    const rep95 = await client.chat.postMessage({
      channel: pubChannel,
      text: `Channels renamed: `,
    });
    const rep8 = await client.chat.postMessage({
      channel: privChannel,
      text: `User groups added: `,
    });
    const rep9 = await client.chat.postMessage({
      channel: privChannel,
      text: `User groups modified: `,
    });
    const rep10 = await client.chat.postMessage({
      channel: privChannel,
      text: `User groups deleted: `,
    });
    const rep11 = await client.chat.postMessage({
      channel: privChannel,
      text: `Emojis added: `,
    });
    const rep94 = await client.chat.postMessage({
      channel: pubChannel,
      text: `Emojis added: `,
    });
    const rep16 = await client.chat.postMessage({
      channel: privChannel,
      text: `Emoji aliases added: `,
    });
    const rep93 = await client.chat.postMessage({
      channel: pubChannel,
      text: `Emoji aliases added: `,
    });
    const rep12 = await client.chat.postMessage({
      channel: privChannel,
      text: `Emojis edited: `,
    });
    const rep92 = await client.chat.postMessage({
      channel: pubChannel,
      text: `Emojis edited: `,
    });
    const rep13 = await client.chat.postMessage({
      channel: privChannel,
      text: `Emojis removed: `,
    });
    const rep91 = await client.chat.postMessage({
      channel: pubChannel,
      text: `Emojis removed: `,
    });
    const rep14 = await client.chat.postMessage({
      channel: privChannel,
      text: `Do Not Disturb set to true: `,
    });
    const rep15 = await client.chat.postMessage({
      channel: privChannel,
      text: `Do Not Disturb set to false: `,
    });
    const rep17 = await client.chat.postMessage({
      channel: privChannel,
      text: `Huddle joiners: `,
    });
    const rep18 = await client.chat.postMessage({
      channel: privChannel,
      text: `Huddle leavers: `,
    });
    const rep19 = await client.chat.postMessage({
      channel: privChannel,
      text: `Files created: `,
    });
    const rep20 = await client.chat.postMessage({
      channel: privChannel,
      text: `Files shared: `,
    });
    const rep21 = await client.chat.postMessage({
      channel: privChannel,
      text: `Files changed: `,
    });
    const rep22 = await client.chat.postMessage({
      channel: privChannel,
      text: `Files deleted: `,
    });
    const rep23 = await client.chat.postMessage({
      channel: privChannel,
      text: `Files made public: `,
    });
    const rep24 = await client.chat.postMessage({
      channel: privChannel,
      text: `Files unshared: `,
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
      },
      {
        fields: { 
          "Field": "File Created", 
          "Messagets": rep19.ts,
          "Number": 0
        }
      },
      {
        fields: { 
          "Field": "File Shared", 
          "Messagets": rep20.ts,
          "Number": 0
        }
      },
      {
        fields: { 
          "Field": "File Changed", 
          "Messagets": rep21.ts,
          "Number": 0
        }
      },
      {
        fields: { 
          "Field": "File Deleted", 
          "Messagets": rep22.ts,
          "Number": 0
        }
      },
      {
        fields: { 
          "Field": "File Public", 
          "Messagets": rep23.ts,
          "Number": 0
        }
      },
      {
        fields: { 
          "Field": "File Unshared", 
          "Messagets": rep24.ts,
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
  } catch (error) {
    logger.error(error);
  }
};

export { sampleCommandCallback };
