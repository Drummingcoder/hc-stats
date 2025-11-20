import type { App } from '@slack/bolt';

import Airtable from 'airtable';
import { NONAME } from 'node:dns';
const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
  throw new Error('Missing AIRTABLE_PAT or AIRTABLE_BASE_ID environment variables');
}

const base = new Airtable({ apiKey: "" }).base("appv3qGFvudMIng9P");

const register = (app: App) => {
  app.event('message', async ({ event, client, logger }) => {
    try {
      const msg = event as any;
      if (msg.text == "time to run and go") {
        const rep1 = await client.chat.postMessage({
          channel: msg.channel,
          text: `New users for today: `,
        });
        const rep2 = await client.chat.postMessage({
          channel: msg.channel,
          text: `New bots for today: `,
        });

        const rep3 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Channels created: `,
        });
        const rep4 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Channels archived: `,
        });
        const rep5 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Channels deleted: `,
        });
        const rep6 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Channels unarchived: `,
        });
        const rep7 = await client.chat.postMessage({
          channel: msg.channel,
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
        const rep12 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Emojis edited: `,
        });
        const rep13 = await client.chat.postMessage({
          channel: msg.channel,
          text: `Emojis removed: `,
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
              "Number": 0
            }
          },
          {
            fields: { 
              "Field": "New Workflow Bot", 
              "Messagets": rep2.ts,
              "Number": 0
            }
          }, 
          {
            fields: { 
              "Field": "Channel Created", 
              "Messagets": rep3.ts,
              "Number": 0
            }
          },
          {
            fields: { 
              "Field": "Channel Archived", 
              "Messagets": rep4.ts,
              "Number": 0
            }
          }, 
          {
            fields: { 
              "Field": "Channel Deleted", 
              "Messagets": rep5.ts,
              "Number": 0
            }
          }, 
          {
            fields: { 
              "Field": "Channel Unarchived", 
              "Messagets": rep6.ts,
              "Number": 0
            }
          },
          {
            fields: { 
              "Field": "Channel Renamed", 
              "Messagets": rep7.ts,
              "Number": 0
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
              "Number": 0
            }
          },
          {
            fields: { 
              "Field": "Emoji Changed", 
              "Messagets": rep12.ts,
              "Number": 0
            }
          },
          {
            fields: { 
              "Field": "Emoji Removed", 
              "Messagets": rep13.ts,
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
        const records12 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Subteam Deleted"`
        }).firstPage();
        const recordId12 = records12[0].id;
        await base('Data').update([{ id: recordId12, fields: airtablePayload[11].fields }]);
        const records12 = await base('Data').select({
          maxRecords: 1,
          filterByFormula: `{Field} = "Subteam Deleted"`
        }).firstPage();
        const recordId12 = records12[0].id;
        await base('Data').update([{ id: recordId12, fields: airtablePayload[11].fields }]);
        
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
          fields: ['Field', 'Messagets', 'Number'] 
        }).firstPage();
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user.id}> the workflow bot has joined! Join type: ${event.type}`,
          thread_ts: ts[0].fields.Messagets,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "New Workflow Bot", 
              "Messagets": rep1.ts,
              "Number": (ts[0].fields.Number + 1)
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
          fields: ['Field', 'Messagets', 'Number'] 
        }).firstPage();
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user.id}> the app has joined! Join type: ${event.type}`,
          thread_ts: ts[0].fields.Messagets,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "New Bot", 
              "Messagets": rep1.ts,
              "Number": (ts[0].fields.Number + 1)
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
          thread_ts: ts[0].fields.Messagets,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "New User", 
              "Messagets": rep1.ts,
              "Number": (ts[0].fields.Number + 1)
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
        fields: ['Field', 'Messagets', 'Number'] 
      }).firstPage();
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel.id}> (${event.channel.name}) by <@${event.channel.creator}> has been created.`,
        thread_ts: ts[0].fields.Messagets,
      });
      const airtablePayload = [
        {
          fields: { 
            "Field": "Channel Created", 
            "Messagets": rep1.ts,
            "Number": (ts[0].fields.Number + 1)
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
        fields: ['Field', 'Messagets', 'Number'] 
      }).firstPage();
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel}> was archived by <@${event.user}>.`,
        thread_ts: ts[0].fields.Messagets,
      });
      const airtablePayload = [
        {
          fields: { 
            "Field": "Channel Archived", 
            "Messagets": rep1.ts,
            "Number": (ts[0].fields.Number + 1)
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
        fields: ['Field', 'Messagets', 'Number'] 
      }).firstPage();
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel}> was deleted.`,
        thread_ts: ts[0].fields.Messagets,
      });
      const airtablePayload = [
        {
          fields: { 
            "Field": "Channel Deleted", 
            "Messagets": rep1.ts,
            "Number": (ts[0].fields.Number + 1)
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
        fields: ['Field', 'Messagets', 'Number'] 
      }).firstPage();
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel.id}> (${event.channel.name}) was renamed.`,
        thread_ts: ts[0].fields.Messagets,
      });
      const airtablePayload = [
        {
          fields: { 
            "Field": "Channel Renamed", 
            "Messagets": rep1.ts,
            "Number": (ts[0].fields.Number + 1)
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
        fields: ['Field', 'Messagets', 'Number'] 
      }).firstPage();
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel}> was unarchived by <@${event.user}>.`,
        thread_ts: ts[0].fields.Messagets,
      });
      const airtablePayload = [
        {
          fields: { 
            "Field": "Channel Unarchived", 
            "Messagets": rep1.ts,
            "Number": (ts[0].fields.Number + 1)
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
        thread_ts: ts[0].fields.Messagets,
      });
      const airtablePayload = [
        {
          fields: { 
            "Field": "Subteam Added", 
            "Messagets": rep1.ts,
            "Number": (ts[0].fields.Number + 1)
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
        removedarray = event.removed_users.map(id => `<#${id}>`).join(', ');
      }

      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<!subteam^${event.subteam_id}> change was a member one:\n
        Added users: ${addarray}\n
        Added count: ${event.added_users_count}\n
        Deleted users: ${removedarray}\n
        Deleted count: ${event.removed_users_count}\n`,
        thread_ts: ts[0].fields.Messagets,
      });
      const airtablePayload = [
        {
          fields: { 
            "Field": "Subteam Members Changed", 
            "Messagets": rep1.ts,
            "Number": (ts[0].fields.Number + 1)
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
          thread_ts: ts[0].fields.Messagets,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "Subteam Deleted",
              "Messagets": rep1.ts,
              "Number": (ts[0].fields.Number + 1)
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
          thread_ts: ts[0].fields.Messagets,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "Subteam Changed", 
              "Messagets": rep1.ts,
              "Number": (ts[0].fields.Number + 1)
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
        const formula = `{Field} = "Emoji Added"`;
        const ts = await base("Data").select({
          maxRecords: 10,
          filterByFormula: formula,
          fields: ['Field', 'Messagets', 'Number'] 
        }).firstPage();
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `:${event.name}: was added!`,
          thread_ts: ts[0].fields.Messagets,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "Emoji Added",
              "Messagets": rep1.ts,
              "Number": (ts[0].fields.Number + 1)
            }
          }
        ];
        const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
        logger.info(result);
      } else if (event.subtype == 'remove') {
        const formula = `{Field} = "Emoji Removed"`;
        const ts = await base("Data").select({
          maxRecords: 10,
          filterByFormula: formula,
          fields: ['Field', 'Messagets', 'Number'] 
        }).firstPage();
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `:${event.name}: was removed.`,
          thread_ts: ts[0].fields.Messagets,
        });
        const airtablePayload = [
          {
            fields: { 
              "Field": "Emoji Removed",
              "Messagets": rep1.ts,
              "Number": (ts[0].fields.Number + 1)
            }
          }
        ];
        const result = await base('Data').update([{ id: ts[0].id, fields: airtablePayload[0].fields }]);
      }
      logger.info(event);
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });
};

export default { register };
