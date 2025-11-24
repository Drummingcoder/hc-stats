import type { App } from '@slack/bolt';

import Airtable from 'airtable';
import { NONAME } from 'node:dns';
const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
  throw new Error('Missing AIRTABLE_PAT or AIRTABLE_BASE_ID environment variables');
}

const base = new Airtable({ apiKey: AIRTABLE_PAT }).base(AIRTABLE_BASE_ID);

const register = (app: App) => {
  app.event('message', async ({ event, client, logger }) => {
    try {
      const msg = event as any;
      if (msg.text == "time to run and go sigma76973213245") {
        const allRecords = await base('Data').select({}).all();
        const recordMap = Object.fromEntries(
          allRecords.map(r => [r.fields["Field"], r])
        );
        await client.chat.postMessage({
          channel: msg.channel,
          text: `Yesterday: \n
          New users joined: ${recordMap["New User"]?.fields["Number"] ?? 0}\n
          New bots joined: ${recordMap["New Bot"]?.fields["Number"] ?? 0}\n
          New workflows made: ${recordMap["New Workflow Bot"]?.fields["Number"] ?? 0}\n
          Channels created: ${recordMap["Channel Created"]?.fields["Number"] ?? 0}\n
          Channels archived: ${recordMap["Channel Archived"]?.fields["Number"] ?? 0}\n
          Channels deleted: ${recordMap["Channel Deleted"]?.fields["Number"] ?? 0}\n
          Channels unarchived: ${recordMap["Channel Unarchived"]?.fields["Number"] ?? 0}\n
          Channels renamed: ${recordMap["Channel Renamed"]?.fields["Number"] ?? 0}\n
          User groups added: ${recordMap["Subteam Added"]?.fields["Number"] ?? 0}\n
          User groups edited: ${recordMap["Subteam Changed"]?.fields["Number"] ?? 0} with ${recordMap["Subteam Members Changed"]?.fields["Number"] ?? 0} of those edits being member changes\n
          User groups deleted: ${recordMap["Subteam Deleted"]?.fields["Number"] ?? 0}\n
          Emojis added: ${recordMap["Emoji Added"]?.fields["Number"] ?? 0}\n
          Emoji alias added: ${recordMap["Emoji Alias Added"]?.fields["Number"] ?? 0}\n
          Emojis changed: ${recordMap["Emoji Changed"]?.fields["Number"] ?? 0}\n
          Emojis deleted: ${recordMap["Emoji Removed"]?.fields["Number"] ?? 0}\n
          Number of times Do Not Disturb was turned on: ${recordMap["Dnd Set Active"]?.fields["Number"] ?? 0}\n
          Number of times Do Not Disturb was turned off: ${recordMap["Dnd Set Inactive"]?.fields["Number"] ?? 0}\n
          Number of times a huddle was joined: ${recordMap["Huddle Joined"]?.fields["Number"] ?? 0}\n
          Number of times a huddle was left: ${recordMap["Huddle Left"]?.fields["Number"] ?? 0}\n
          `,
        });
        await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `Yesterday: \n
          New users joined: ${recordMap["New User"]?.fields["Number"] ?? 0}\n
          New bots joined: ${recordMap["New Bot"]?.fields["Number"] ?? 0}\n
          New workflows made: ${recordMap["New Workflow Bot"]?.fields["Number"] ?? 0}\n
          Channels created: ${recordMap["Channel Created"]?.fields["Number"] ?? 0}\n
          Channels archived: ${recordMap["Channel Archived"]?.fields["Number"] ?? 0}\n
          Channels deleted: ${recordMap["Channel Deleted"]?.fields["Number"] ?? 0}\n
          Channels unarchived: ${recordMap["Channel Unarchived"]?.fields["Number"] ?? 0}\n
          Channels renamed: ${recordMap["Channel Renamed"]?.fields["Number"] ?? 0}\n
          User groups added: ${recordMap["Subteam Added"]?.fields["Number"] ?? 0}\n
          User groups edited: ${recordMap["Subteam Changed"]?.fields["Number"] ?? 0} with ${recordMap["Subteam Members Changed"]?.fields["Number"] ?? 0} of those edits being member changes\n
          User groups deleted: ${recordMap["Subteam Deleted"]?.fields["Number"] ?? 0}\n
          Emojis added: ${recordMap["Emoji Added"]?.fields["Number"] ?? 0}\n
          Emoji alias added: ${recordMap["Emoji Alias Added"]?.fields["Number"] ?? 0}\n
          Emojis changed: ${recordMap["Emoji Changed"]?.fields["Number"] ?? 0}\n
          Emojis deleted: ${recordMap["Emoji Removed"]?.fields["Number"] ?? 0}\n
          Number of times Do Not Disturb was turned on: ${recordMap["Dnd Set Active"]?.fields["Number"] ?? 0}\n
          Number of times Do Not Disturb was turned off: ${recordMap["Dnd Set Inactive"]?.fields["Number"] ?? 0}\n
          Number of times a huddle was joined: ${recordMap["Huddle Joined"]?.fields["Number"] ?? 0}\n
          Number of times a huddle was left: ${recordMap["Huddle Left"]?.fields["Number"] ?? 0}\n
          `,
        });
        const rep1 = await client.chat.postMessage({
          channel: msg.channel,
          text: `New users for today: `,
        });
        const rep2 = await client.chat.postMessage({
          channel: msg.channel,
          text: `New bots for today: `,
        });
        const rep100 = await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `New bots for today: `,
        });
        const rep3 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Channels created: `,
        });
        const rep99 = await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `Channels created: `,
        });
        const rep4 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Channels archived: `,
        });
        const rep98 = await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `Channels archived: `,
        });
        const rep5 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Channels deleted: `,
        });
        const rep97 = await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `Channels deleted: `,
        });
        const rep6 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Channels unarchived: `,
        });
        const rep96 = await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `Channels unarchived: `,
        });
        const rep7 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Channels renamed: `,
        });
        const rep95 = await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `Channels renamed: `,
        });
        const rep8 = await client.chat.postMessage({
          channel: msg.channel,
          text: `User groups added: `,
        });
        const rep9 = await client.chat.postMessage({
          channel: msg.channel,
          text: `User groups modified: `,
        });
        const rep10 = await client.chat.postMessage({
          channel: msg.channel,
          text: `User groups deleted: `,
        });
        const rep11 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Emojis added: `,
        });
        const rep94 = await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `Emojis added: `,
        });
        const rep16 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Emoji aliases added: `,
        });
        const rep93 = await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `Emoji aliases added: `,
        });
        const rep12 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Emojis edited: `,
        });
        const rep92 = await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `Emojis edited: `,
        });
        const rep13 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Emojis removed: `,
        });
        const rep91 = await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `Emojis removed: `,
        });
        const rep14 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Do Not Disturb set to true: `,
        });
        const rep15 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Do Not Disturb set to false: `,
        });
        const rep17 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Huddle joiners: `,
        });
        const rep18 = await client.chat.postMessage({
          channel: msg.channel,
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
        const records = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "New User"`
        }).firstPage();
        const recordId = records[0].id;
        await base('Data').update([{ id: recordId, fields: airtablePayload[0].fields }]);
        const records2 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "New Bot"`
        }).firstPage();
        const recordId2 = records2[0].id;
        await base('Data').update([{ id: recordId2, fields: airtablePayload[1].fields }]);
        const records3 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "New Workflow Bot"`
        }).firstPage();
        const recordId3 = records3[0].id;
        await base('Data').update([{ id: recordId3, fields: airtablePayload[2].fields }]);
        const records4 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Channel Created"`
        }).firstPage();
        const recordId4 = records4[0].id;
        await base('Data').update([{ id: recordId4, fields: airtablePayload[3].fields }]);
        const records5 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Channel Archived"`
        }).firstPage();
        const recordId5 = records5[0].id;
        await base('Data').update([{ id: recordId5, fields: airtablePayload[4].fields }]);
        const records6 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Channel Deleted"`
        }).firstPage();
        const recordId6 = records6[0].id;
        await base('Data').update([{ id: recordId6, fields: airtablePayload[5].fields }]);
        const records7 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Channel Unarchived"`
        }).firstPage();
        const recordId7 = records7[0].id;
        await base('Data').update([{ id: recordId7, fields: airtablePayload[6].fields }]);
        const records8 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Channel Renamed"`
        }).firstPage();
        const recordId8 = records8[0].id;
        await base('Data').update([{ id: recordId8, fields: airtablePayload[7].fields }]);
        const records9 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Subteam Added"`
        }).firstPage();
        const recordId9 = records9[0].id;
        await base('Data').update([{ id: recordId9, fields: airtablePayload[8].fields }]);
        const records10 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Subteam Members Changed"`
        }).firstPage();
        const recordId10 = records10[0].id;
        await base('Data').update([{ id: recordId10, fields: airtablePayload[9].fields }]);
        const records11 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Subteam Changed"`
        }).firstPage();
        const recordId11 = records11[0].id;
        await base('Data').update([{ id: recordId11, fields: airtablePayload[10].fields }]);
        const records12 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Subteam Deleted"`
        }).firstPage();
        const recordId12 = records12[0].id;
        await base('Data').update([{ id: recordId12, fields: airtablePayload[11].fields }]);
        const records13 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Emoji Added"`
        }).firstPage();
        const recordId13 = records13[0].id;
        await base('Data').update([{ id: recordId13, fields: airtablePayload[12].fields }]);
        const records14 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Emoji Changed"`
        }).firstPage();
        const recordId14 = records14[0].id;
        await base('Data').update([{ id: recordId14, fields: airtablePayload[13].fields }]);
        const records15 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Emoji Removed"`
        }).firstPage();
        const recordId15 = records15[0].id;
        await base('Data').update([{ id: recordId15, fields: airtablePayload[14].fields }]);
        const records16 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Dnd Set Active"`
        }).firstPage();
        const recordId16 = records16[0].id;
        await base('Data').update([{ id: recordId16, fields: airtablePayload[15].fields }]);
        const records17 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Dnd Set Inactive"`
        }).firstPage();
        const recordId17 = records17[0].id;
        await base('Data').update([{ id: recordId17, fields: airtablePayload[16].fields }]);
        const records18 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Emoji Alias Added"`
        }).firstPage();
        const recordId18 = records18[0].id;
        await base('Data').update([{ id: recordId18, fields: airtablePayload[17].fields }]);
        const records19 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Huddle Joined"`
        }).firstPage();
        const recordId19 = records19[0].id;
        await base('Data').update([{ id: recordId19, fields: airtablePayload[18].fields }]);
        const records20 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Huddle Left"`
        }).firstPage();
        const recordId20 = records20[0].id;
        await base('Data').update([{ id: recordId20, fields: airtablePayload[19].fields }]);
      }
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('team_join', async ({ event, client, logger }) => {
    try {
      logger.info(event.user);
      if (event.user.is_workflow_bot) {
        const formula = `{Field} = "New Workflow Bot"`;
        const ts = await base("Data").select({
          maxRecords: 10,
          filterByFormula: formula,
          fields: ['Field', 'Messagets', 'Number', 'PubMes'] 
        }).firstPage();
        const messagets = ts[0].fields.Messagets as string | undefined;
        let num = Number(ts[0].fields.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user.id}> the workflow bot has joined! Join type: ${event.type}`,
          thread_ts: messagets,
        });
        const pubmes = ts[0].fields.PubMes as string | undefined;
        await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `<@${event.user.id}> the workflow bot has joined! Join type: ${event.type}`,
          thread_ts: pubmes,
        });
        await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `<@${event.user.id}> the workflow bot has joined! Join type: ${event.type}`,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "New Workflow Bot", 
              "Messagets": rep1.ts,
              "Number": (num + 1)
            }
          }
        ];
        const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
        logger.info(result);
      } else if (event.user.is_bot) {
        const formula = `{Field} = "New Bot"`;
        const ts = await base("Data").select({
          maxRecords: 10,
          filterByFormula: formula,
          fields: ['Field', 'Messagets', 'Number', 'PubMes']
        }).firstPage();
        const messagets = ts[0].fields.Messagets as string | undefined;
        let num = Number(ts[0].fields.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user.id}> the app has joined! Join type: ${event.type}`,
          thread_ts: messagets,
        });
        const pubmes = ts[0].fields.PubMes as string | undefined;
        await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `<@${event.user.id}> the app has joined! Join type: ${event.type}`,
          thread_ts: pubmes,
        });
        await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `<@${event.user.id}> the app has joined! Join type: ${event.type}`,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "New Bot", 
              "Messagets": rep1.ts,
              "Number": (num + 1)
            }
          }
        ];
        const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
        logger.info(result);
      } else {
        const formula = `{Field} = "New User"`;
        const ts = await base("Data").select({
          maxRecords: 10,
          filterByFormula: formula,
          fields: ['Field', 'Messagets', 'Number'] 
        }).firstPage();
        const messagets = ts[0].fields.Messagets as string | undefined;
        let num = Number(ts[0].fields.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user.id}> has joined! Details:\n
          Join type: ${event.type}\n
          Display name: ${event.user.name}\n
          Admin (likely not): ${event.user.is_admin ?? false}\n
          Owner (very likely not): ${event.user.is_owner ?? false}\n
          Real name: ${event.user.real_name ?? event.user.profile.real_name ?? 'N/A'}\n
          MCG status: ${event.user.is_restricted ?? false}\n
          SCG (single) status: ${event.user.is_ultra_restricted ?? false}\n
          Email: ${event.user.profile?.email ?? 'N/A'}\n
          External (Slack Connect): ${event.user.is_stranger ?? false}\n
          Invited: ${event.user.is_invited_user}\n`, 
          thread_ts: messagets,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "New User", 
              "Messagets": rep1.ts,
              "Number": (num + 1)
            }
          }
        ];
        const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
        logger.info(result);
      }
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('channel_created', async ({ event, client, logger }) => {
    try {
      const formula = `{Field} = "Channel Created"`;
      const ts = await base("Data").select({
        maxRecords: 10,
        filterByFormula: formula,
        fields: ['Field', 'Messagets', 'Number', 'PubMes'] 
      }).firstPage();
      const messagets = ts[0].fields.Messagets as string | undefined;
      let num = Number(ts[0].fields.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel.id}> (${event.channel.name}) by <@${event.channel.creator}> has been created.`,
        thread_ts: messagets,
      });
      const pubmes = ts[0].fields.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel.id}> (${event.channel.name}) by <@${event.channel.creator}> has been created.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel.id}> (${event.channel.name}) by <@${event.channel.creator}> has been created.`,
      });
      const airtablePayload = [
        {
          fields: { 
            "Field": "Channel Created", 
            "Messagets": rep1.ts,
            "Number": (num + 1)
          }
        }
      ];
      const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
      logger.info(result);
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('channel_archive', async ({ event, client, logger }) => {
    try {
      const formula = `{Field} = "Channel Archived"`;
      const ts = await base("Data").select({
        maxRecords: 10,
        filterByFormula: formula,
        fields: ['Field', 'Messagets', 'Number', 'PubMes']  
      }).firstPage();
      const messagets = ts[0].fields.Messagets as string | undefined;
      let num = Number(ts[0].fields.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel}> was archived by <@${event.user}>.`,
        thread_ts: messagets,
      });
      const pubmes = ts[0].fields.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel}> was archived by <@${event.user}>.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel}> was archived by <@${event.user}>.`,
      });
      const airtablePayload = [
        {
          fields: { 
            "Field": "Channel Archived", 
            "Messagets": rep1.ts,
            "Number": (num + 1)
          }
        }
      ];
      const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
      logger.info(result);
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('channel_deleted', async ({ event, client, logger }) => {
    try {
      const formula = `{Field} = "Channel Deleted"`;
      const ts = await base("Data").select({
        maxRecords: 10,
        filterByFormula: formula,
        fields: ['Field', 'Messagets', 'Number', 'PubMes'] 
      }).firstPage();
      const messagets = ts[0].fields.Messagets as string | undefined;
      let num = Number(ts[0].fields.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel}> was deleted.`,
        thread_ts: messagets,
      });
      const pubmes = ts[0].fields.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel}> was deleted.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel}> was deleted.`,
      });
      const airtablePayload = [
        {
          fields: { 
            "Field": "Channel Deleted", 
            "Messagets": rep1.ts,
            "Number": (num + 1)
          }
        }
      ];
      const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
      logger.info(result);
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('channel_rename', async ({ event, client, logger }) => {
    try {
      const formula = `{Field} = "Channel Renamed"`;
      const ts = await base("Data").select({
        maxRecords: 10,
        filterByFormula: formula,
        fields: ['Field', 'Messagets', 'Number', 'PubMes']  
      }).firstPage();
      const messagets = ts[0].fields.Messagets as string | undefined;
      let num = Number(ts[0].fields.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel.id}> (${event.channel.name}) was renamed.`,
        thread_ts: messagets,
      });
      const pubmes = ts[0].fields.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel.id}> (${event.channel.name}) was renamed.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel.id}> (${event.channel.name}) was renamed.`,
      });
      const airtablePayload = [
        {
          fields: { 
            "Field": "Channel Renamed", 
            "Messagets": rep1.ts,
            "Number": (num + 1)
          }
        }
      ];
      const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
      logger.info(result);
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('channel_unarchive', async ({ event, client, logger }) => {
    try {
      const formula = `{Field} = "Channel Unarchived"`;
      const ts = await base("Data").select({
        maxRecords: 10,
        filterByFormula: formula,
        fields: ['Field', 'Messagets', 'Number', 'PubMes'] 
      }).firstPage();
      const messagets = ts[0].fields.Messagets as string | undefined;
      let num = Number(ts[0].fields.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel}> was unarchived by <@${event.user}>.`,
        thread_ts: messagets,
      });
      const pubmes = ts[0].fields.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel}> was unarchived by <@${event.user}>.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel}> was unarchived by <@${event.user}>.`,
      });
      const airtablePayload = [
        {
          fields: { 
            "Field": "Channel Unarchived", 
            "Messagets": rep1.ts,
            "Number": (num + 1)
          }
        }
      ];
      const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
      logger.info(result);
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('subteam_created', async ({ event, client, logger }) => {
    try {
      const formula = `{Field} = "Subteam Added"`;
      const ts = await base("Data").select({
        maxRecords: 10,
        filterByFormula: formula,
        fields: ['Field', 'Messagets', 'Number'] 
      }).firstPage();
      let usersarray = "none";
      if (event.subteam.users && event.subteam.users.length > 0) {
        usersarray = event.subteam.users.map(id => `<@${id}>`).join(', ');
      }

      let channelarray = "none";
      if (event.subteam.prefs?.channels && event.subteam.prefs.channels.length > 0) {
        channelarray = event.subteam.prefs.channels.map(id => `<#${id}>`).join(', ');
      }
      const messagets = ts[0].fields.Messagets as string | undefined;
      let num = Number(ts[0].fields.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<!subteam^${event.subteam.id}> (${event.subteam.handle}) was made by <@${event.subteam.created_by}>. Details: \n
          Name: ${event.subteam.name}\n
          Users: ${usersarray}\n
          User count: ${event.subteam.user_count}\n
          Description: ${event.subteam.description}\n
          Channels: ${channelarray}\n
          Channel count: ${event.subteam.channel_count}
          `,
        thread_ts: messagets,
      });
      const airtablePayload = [
        {
          fields: { 
            "Field": "Subteam Added", 
            "Messagets": rep1.ts,
            "Number": (num + 1)
          }
        }
      ];
      const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
      logger.info(result);
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('subteam_members_changed', async ({ event, client, logger }) => {
    try {
      const formula = `{Field} = "Subteam Members Changed"`;
      const ts = await base("Data").select({
        maxRecords: 10,
        filterByFormula: formula,
        fields: ['Field', 'Messagets', 'Number'] 
      }).firstPage();
      let addarray = "none";
      if (event.added_users && event.added_users.length > 0) {
        addarray = event.added_users.map(id => `<@${id}>`).join(', ');
      }

      let removedarray = "none";
      if (event.removed_users && event.removed_users.length > 0) {
        removedarray = event.removed_users.map(id => `<@${id}>`).join(', ');
      }

      const messagets = ts[0].fields.Messagets as string | undefined;
      let num = Number(ts[0].fields.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<!subteam^${event.subteam_id}> change was a member one:\n
        Added users: ${addarray}\n
        Added count: ${event.added_users_count}\n
        Deleted users: ${removedarray}\n
        Deleted count: ${event.removed_users_count}\n`,
        thread_ts: messagets,
      });
      const airtablePayload = [
        {
          fields: { 
            "Field": "Subteam Members Changed", 
            "Messagets": rep1.ts,
            "Number": (num + 1)
          }
        }
      ];
      const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
      logger.info(result);
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('subteam_updated', async ({ event, client, logger }) => {
    try {
      let usersarray = "none";
      if (event.subteam.users && event.subteam.users.length > 0) {
        usersarray = event.subteam.users.map(id => `<@${id}>`).join(', ');
      }

      let channelarray = "none";
      if (event.subteam.prefs?.channels && event.subteam.prefs.channels.length > 0) {
        channelarray = event.subteam.prefs.channels.map(id => `<#${id}>`).join(', ');
      }
      if (event.subteam && 'deleted_by' in event.subteam && (event.subteam as any).deleted_by) {
        const formula = `{Field} = "Subteam Deleted"`;
        const ts = await base("Data").select({
          maxRecords: 10,
          filterByFormula: formula,
          fields: ['Field', 'Messagets', 'Number'] 
        }).firstPage();
        const messagets = ts[0].fields.Messagets as string | undefined;
        let num = Number(ts[0].fields.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<!subteam^${event.subteam.id}> was deleted by <@${event.subteam.deleted_by}>. Details:\n
          Date created: ${event.subteam.date_create}\n
          Name: ${event.subteam.name}\n
          Handle: ${event.subteam.handle}\n
          Created by: <@${event.subteam.created_by}>\n
          Description: ${event.subteam.description}\n
          Members: ${usersarray}\n
          Member count: ${event.subteam.user_count}\n
          Channels: ${channelarray}\n
          Channel count: ${event.subteam.channel_count}`,
          thread_ts: messagets,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "Subteam Deleted",
              "Messagets": rep1.ts,
              "Number": (num + 1)
            }
          }
        ];
        const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
        logger.info(result);
      } else {
        const formula = `{Field} = "Subteam Changed"`;
        const ts = await base("Data").select({
          maxRecords: 10,
          filterByFormula: formula,
          fields: ['Field', 'Messagets', 'Number'] 
        }).firstPage();
        const messagets = ts[0].fields.Messagets as string | undefined;
        let num = Number(ts[0].fields.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<!subteam^${event.subteam.id}> was updated by <@${event.subteam.updated_by}>. Details:\n
          Date created: ${event.subteam.date_create}\n
          Name: ${event.subteam.name}\n
          Created by: <@${event.subteam.created_by}>\n
          Description: ${event.subteam.description}\n
          Members: ${usersarray}\n
          Member count: ${event.subteam.user_count}\n
          Channels: ${channelarray}\n
          Channel count: ${event.subteam.channel_count}`,
          thread_ts: messagets,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "Subteam Changed", 
              "Messagets": rep1.ts,
              "Number": (num + 1)
            }
          }
        ];
        const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
        logger.info(result);
      }
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('emoji_changed', async ({ event, client, logger }) => {
    try {
      if (event.subtype == 'add') {
        if (event.value?.startsWith("alias")) {
          const formula = `{Field} = "Emoji Alias Added"`;
          const ts = await base("Data").select({
            maxRecords: 10,
            filterByFormula: formula,
            fields: ['Field', 'Messagets', 'Number', 'PubMes'] 
          }).firstPage();
          const messagets = ts[0].fields.Messagets as string | undefined;
          let num = Number(ts[0].fields.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: "C09TXAZ8GAG",
            text: `:${event.name}: was added (alias of :${event.value.split(":")[1]}:)!`,
            thread_ts: messagets,
          });
          const pubmes = ts[0].fields.PubMes as string | undefined;
          await client.chat.postMessage({
            channel: "C09UH2LCP1Q",
            text: `:${event.name}: was added (alias of :${event.value.split(":")[1]}:)!`,
            thread_ts: pubmes,
          });
          await client.chat.postMessage({
            channel: "C09UH2LCP1Q",
            text: `:${event.name}: was added (alias of :${event.value.split(":")[1]}:)!`,
          });
          const airtablePayload = [
            {
              fields: { 
                "Field": "Emoji Alias Added",
                "Messagets": rep1.ts,
                "Number": (num + 1)
              }
            }
          ];
          const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
          logger.info(result);
        } else {
          const formula = `{Field} = "Emoji Added"`;
          const ts = await base("Data").select({
            maxRecords: 10,
            filterByFormula: formula,
            fields: ['Field', 'Messagets', 'Number', 'PubMes']
          }).firstPage();
          const messagets = ts[0].fields.Messagets as string | undefined;
          let num = Number(ts[0].fields.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: "C09TXAZ8GAG",
            text: `:${event.name}: was added!`,
            thread_ts: messagets,
          });
          const pubmes = ts[0].fields.PubMes as string | undefined;
          await client.chat.postMessage({
            channel: "C09UH2LCP1Q",
            text: `:${event.name}: was added!`,
            thread_ts: pubmes,
          });
          await client.chat.postMessage({
            channel: "C09UH2LCP1Q",
            text: `:${event.name}: was added!`,
          });
          const airtablePayload = [
            {
              fields: { 
                "Field": "Emoji Added",
                "Messagets": rep1.ts,
                "Number": (num + 1)
              }
            }
          ];
          const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
          logger.info(result);
        }
      } else if (event.subtype == 'remove') {
        const formula = `{Field} = "Emoji Removed"`;
        const ts = await base("Data").select({
          maxRecords: 10,
          filterByFormula: formula,
          fields: ['Field', 'Messagets', 'Number', 'PubMes'] 
        }).firstPage();
        const messagets = ts[0].fields.Messagets as string | undefined;
        let num = Number(ts[0].fields.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `${event.names} was removed.`,
          thread_ts: messagets,
        });
        const pubmes = ts[0].fields.PubMes as string | undefined;
        await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `${event.names} was removed.`,
          thread_ts: pubmes,
        });
        await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `${event.names} was removed.`,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "Emoji Removed",
              "Messagets": rep1.ts,
              "Number": (num + 1),
            }
          }
        ];
        const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
        logger.info(result);
      } else if (event.subtype == "rename") {
        const formula = `{Field} = "Emoji Changed"`;
        const ts = await base("Data").select({
          maxRecords: 10,
          filterByFormula: formula,
          fields: ['Field', 'Messagets', 'Number', 'PubMes'] 
        }).firstPage();
        const messagets = ts[0].fields.Messagets as string | undefined;
        let num = Number(ts[0].fields.Number ?? 0);
        const pubmes = ts[0].fields.PubMes as string | undefined;
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `${event.old_name} was renamed to ${event.new_name}.`,
          thread_ts: messagets,
        });
        await client.chat.postMessage({
            channel: "C09UH2LCP1Q",
            text: `${event.old_name} was renamed to ${event.new_name}.`,
            thread_ts: pubmes,
          });
          await client.chat.postMessage({
            channel: "C09UH2LCP1Q",
            text: `${event.old_name} was renamed to ${event.new_name}.`,
          });
        const airtablePayload = [
          {
            fields: { 
              "Field": "Emoji Changed",
              "Messagets": rep1.ts,
              "Number": (num + 1)
            }
          }
        ];
        const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
        logger.info(result);
      }
      logger.info(event);
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('dnd_updated_user', async ({ event, client, logger }) => {
    try {
      if (event.dnd_status.dnd_enabled) {
        const formula = `{Field} = "Dnd Set Active"`;
        const ts = await base("Data").select({
          maxRecords: 10,
          filterByFormula: formula,
          fields: ['Field', 'Messagets', 'Number'] 
        }).firstPage();
        const start = event.dnd_status.next_dnd_start_ts
          ? new Date(event.dnd_status.next_dnd_start_ts * 1000)
          : null;
        const end = event.dnd_status.next_dnd_end_ts
          ? new Date(event.dnd_status.next_dnd_end_ts * 1000)
          : null;
        const startStr = start ? start.toLocaleString() : 'unknown';
        const endStr = end ? end.toLocaleString() : 'unknown';
        const messagets = ts[0].fields.Messagets as string | undefined;
        let num = Number(ts[0].fields.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user}> has turned on their Do Not Disturb\nStarts: ${startStr}\nEnds: ${endStr}!`,
          thread_ts: messagets,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "Dnd Set Active",
              "Messagets": rep1.ts,
              "Number": (num + 1)
            }
          }
        ];
        const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
        logger.info(result);
      } else if (event.dnd_status.dnd_enabled == false) {
        const formula = `{Field} = "Dnd Set Inactive"`;
        const ts = await base("Data").select({
          maxRecords: 10,
          filterByFormula: formula,
          fields: ['Field', 'Messagets', 'Number'] 
        }).firstPage();
        const messagets = ts[0].fields.Messagets as string | undefined;
        let num = Number(ts[0].fields.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user}> has turned off their Do Not Disturb.`,
          thread_ts: messagets,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "Dnd Set Inactive",
              "Messagets": rep1.ts,
              "Number": (num + 1)
            }
          }
        ];
        const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
        logger.info(result);
      }
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('user_huddle_changed', async ({ event, client, logger }) => {
    try {
      if (event.user.profile.huddle_state == "in_a_huddle") {
        const formula = `{Field} = "Huddle Joined"`;
        const ts = await base("Data").select({
          maxRecords: 10,
          filterByFormula: formula,
          fields: ['Field', 'Messagets', 'Number'] 
        }).firstPage();
        const callId = (event.user.profile as any).huddle_state_call_id;
        const callInfo = callId ? ` (call ID: \`${callId}\`)` : "";
        const messagets = ts[0].fields.Messagets as string | undefined;
        let num = Number(ts[0].fields.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user.id}> has joined a huddle ${callInfo}!`,
          thread_ts: messagets,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "Huddle Joined",
              "Messagets": rep1.ts,
              "Number": (num + 1)
            }
          }
        ];
        const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
        logger.info(result);
      } else {
        const formula = `{Field} = "Huddle Left"`;
        const ts = await base("Data").select({
          maxRecords: 10,
          filterByFormula: formula,
          fields: ['Field', 'Messagets', 'Number'] 
        }).firstPage();
        let num = Number(ts[0].fields.Number ?? 0);
        const messagets = ts[0].fields.Messagets as string | undefined;
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user.id}> has left a huddle.`,
          thread_ts: messagets,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "Huddle Left",
              "Messagets": rep1.ts,
              "Number": (num + 1)
            }
          }
        ];
        const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
        logger.info(result);
      }
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });
};

export default { register };
