import type { App } from '@slack/bolt';

import sqlite3 from 'sqlite3';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { promisify } from 'node:util';

const DB_PATH = process.env.DB_PATH || './data/stats.db';

// Ensure directory exists
const dbDir = dirname(DB_PATH);
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

// Promisify database methods
const dbRun = (sql: string, ...params: any[]) => {
  return new Promise<void>((resolve, reject) => {
    db.run(sql, ...params, function(err: Error | null) {
      if (err) reject(err);
      else resolve();
    });
  });
};

const dbGet = (sql: string, ...params: any[]) => {
  return new Promise<any>((resolve, reject) => {
    db.get(sql, ...params, (err: Error | null, row: any) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql: string, ...params: any[]) => {
  return new Promise<any[]>((resolve, reject) => {
    db.all(sql, ...params, (err: Error | null, rows: any[]) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize database schema
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Field TEXT UNIQUE NOT NULL,
      Messagets TEXT,
      Number INTEGER DEFAULT 0,
      PubMes TEXT
    )
  `);
});

const register = (app: App) => {
  app.event('message', async ({ event, client, logger }) => {
    try {
      const msg = event as any;
      if (msg.text == "time to run and go sigma76973213245") {
        const allRecords = await dbAll('SELECT * FROM Data') as any[];
        const recordMap = Object.fromEntries(
          allRecords.map(r => [r.Field, r])
        );
        await client.chat.postMessage({
          channel: msg.channel,
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
        await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
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
        for (const payload of airtablePayload) {
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            payload.fields.Messagets,
            payload.fields.Number,
            payload.fields.Field
          );
        }
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
        const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'New Workflow Bot') as any;
        const messagets = ts?.Messagets as string | undefined;
        let num = Number(ts?.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user.id}> the workflow bot has joined! Join type: ${event.type}`,
          thread_ts: messagets,
        });
        const pubmes = ts?.PubMes as string | undefined;
        await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `<@${event.user.id}> the workflow bot has joined! Join type: ${event.type}`,
          thread_ts: pubmes,
        });
        await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `<@${event.user.id}> the workflow bot has joined! Join type: ${event.type}`,
        });
        await dbRun(
          'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
          rep1.ts,
          num + 1,
          'New Workflow Bot'
        );
        logger.info('Updated New Workflow Bot record');
      } else if (event.user.is_bot) {
        const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'New Bot') as any;
        const messagets = ts?.Messagets as string | undefined;
        let num = Number(ts?.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user.id}> the app has joined! Join type: ${event.type}`,
          thread_ts: messagets,
        });
        const pubmes = ts?.PubMes as string | undefined;
        await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `<@${event.user.id}> the app has joined! Join type: ${event.type}`,
          thread_ts: pubmes,
        });
        await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `<@${event.user.id}> the app has joined! Join type: ${event.type}`,
        });
        await dbRun(
          'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
          rep1.ts,
          num + 1,
          'New Bot'
        );
        logger.info('Updated New Bot record');
      } else {
        const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'New User') as any;
        const messagets = ts?.Messagets as string | undefined;
        let num = Number(ts?.Number ?? 0);
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
        await dbRun(
          'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
          rep1.ts,
          num + 1,
          'New User'
        );
        logger.info('Updated New User record');
      }
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('channel_created', async ({ event, client, logger }) => {
    try {
      const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Channel Created') as any;
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel.id}> (${event.channel.name}) by <@${event.channel.creator}> has been created.`,
        thread_ts: messagets,
      });
      const pubmes = ts?.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel.id}> (${event.channel.name}) by <@${event.channel.creator}> has been created.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel.id}> (${event.channel.name}) by <@${event.channel.creator}> has been created.`,
      });
      await dbRun(
        'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
        rep1.ts,
        num + 1,
        'Channel Created'
      );
      logger.info('Updated Channel Created record');
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('channel_archive', async ({ event, client, logger }) => {
    try {
      const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Channel Archived') as any;
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel}> was archived by <@${event.user}>.`,
        thread_ts: messagets,
      });
      const pubmes = ts?.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel}> was archived by <@${event.user}>.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel}> was archived by <@${event.user}>.`,
      });
      await dbRun(
        'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
        rep1.ts,
        num + 1,
        'Channel Archived'
      );
      logger.info('Updated Channel Archived record');
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('channel_deleted', async ({ event, client, logger }) => {
    try {
      const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Channel Deleted') as any;
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel}> was deleted.`,
        thread_ts: messagets,
      });
      const pubmes = ts?.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel}> was deleted.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel}> was deleted.`,
      });
      await dbRun(
        'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
        rep1.ts,
        num + 1,
        'Channel Deleted'
      );
      logger.info("Channel deleted logged");
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('channel_rename', async ({ event, client, logger }) => {
    try {
      const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Channel Renamed') as any;
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel.id}> (${event.channel.name}) was renamed.`,
        thread_ts: messagets,
      });
      const pubmes = ts?.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel.id}> (${event.channel.name}) was renamed.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel.id}> (${event.channel.name}) was renamed.`,
      });
      await dbRun(
        'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
        rep1.ts,
        num + 1,
        'Channel Renamed'
      );
      logger.info('Updated Channel Renamed record');
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('channel_unarchive', async ({ event, client, logger }) => {
    try {
      const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Channel Unarchived') as any;
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<#${event.channel}> was unarchived by <@${event.user}>.`,
        thread_ts: messagets,
      });
      const pubmes = ts?.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel}> was unarchived by <@${event.user}>.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: "C09UH2LCP1Q",
        text: `<#${event.channel}> was unarchived by <@${event.user}>.`,
      });
      await dbRun(
        'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
        rep1.ts,
        num + 1,
        'Channel Unarchived'
      );
      logger.info('Updated Channel Unarchived record');
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('subteam_created', async ({ event, client, logger }) => {
    try {
      const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Subteam Added') as any;
      let usersarray = "none";
      if (event.subteam.users && event.subteam.users.length > 0) {
        usersarray = event.subteam.users.map(id => `<@${id}>`).join(', ');
      }

      let channelarray = "none";
      if (event.subteam.prefs?.channels && event.subteam.prefs.channels.length > 0) {
        channelarray = event.subteam.prefs.channels.map(id => `<#${id}>`).join(', ');
      }
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
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
      await dbRun(
        'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
        rep1.ts,
        num + 1,
        'Subteam Added'
      );
      logger.info('Updated Subteam Added record');
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('subteam_members_changed', async ({ event, client, logger }) => {
    try {
      const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Subteam Members Changed') as any;
      let addarray = "none";
      if (event.added_users && event.added_users.length > 0) {
        addarray = event.added_users.map(id => `<@${id}>`).join(', ');
      }

      let removedarray = "none";
      if (event.removed_users && event.removed_users.length > 0) {
        removedarray = event.removed_users.map(id => `<@${id}>`).join(', ');
      }

      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: "C09TXAZ8GAG",
        text: `<!subteam^${event.subteam_id}> change was a member one:\n
        Added users: ${addarray}\n
        Added count: ${event.added_users_count}\n
        Deleted users: ${removedarray}\n
        Deleted count: ${event.removed_users_count}\n`,
        thread_ts: messagets,
      });
      await dbRun(
        'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
        rep1.ts,
        num + 1,
        'Subteam Members Changed'
      );
      logger.info('Updated Subteam Members Changed record');
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
        const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Subteam Deleted') as any;
        const messagets = ts?.Messagets as string | undefined;
        let num = Number(ts?.Number ?? 0);
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
        await dbRun(
          'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
          rep1.ts,
          num + 1,
          'Subteam Deleted'
        );
        logger.info('Updated Subteam Deleted record');
      } else {
        const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Subteam Changed') as any;
        const messagets = ts?.Messagets as string | undefined;
        let num = Number(ts?.Number ?? 0);
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
        await dbRun(
          'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
          rep1.ts,
          num + 1,
          'Subteam Changed'
        );
        logger.info('Updated Subteam Changed record');
      }
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('emoji_changed', async ({ event, client, logger }) => {
    try {
      if (event.subtype == 'add') {
        if (event.value?.startsWith("alias")) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Emoji Alias Added') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: "C09TXAZ8GAG",
            text: `:${event.name}: was added (alias of :${event.value.split(":")[1]}:)!`,
            thread_ts: messagets,
          });
          const pubmes = ts?.PubMes as string | undefined;
          await client.chat.postMessage({
            channel: "C09UH2LCP1Q",
            text: `:${event.name}: was added (alias of :${event.value.split(":")[1]}:)!`,
            thread_ts: pubmes,
          });
          await client.chat.postMessage({
            channel: "C09UH2LCP1Q",
            text: `:${event.name}: was added (alias of :${event.value.split(":")[1]}:)!`,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Emoji Alias Added'
          );
          logger.info('Updated Emoji Alias Added record');
        } else {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Emoji Added') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: "C09TXAZ8GAG",
            text: `:${event.name}: was added!`,
            thread_ts: messagets,
          });
          const pubmes = ts?.PubMes as string | undefined;
          await client.chat.postMessage({
            channel: "C09UH2LCP1Q",
            text: `:${event.name}: was added!`,
            thread_ts: pubmes,
          });
          await client.chat.postMessage({
            channel: "C09UH2LCP1Q",
            text: `:${event.name}: was added!`,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Emoji Added'
          );
          logger.info('Updated Emoji Added record');
        }
      } else if (event.subtype == 'remove') {
        const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Emoji Removed') as any;
        const messagets = ts?.Messagets as string | undefined;
        let num = Number(ts?.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `${event.names} was removed.`,
          thread_ts: messagets,
        });
        const pubmes = ts?.PubMes as string | undefined;
        await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `${event.names} was removed.`,
          thread_ts: pubmes,
        });
        await client.chat.postMessage({
          channel: "C09UH2LCP1Q",
          text: `${event.names} was removed.`,
        });
        await dbRun(
          'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
          rep1.ts,
          num + 1,
          'Emoji Removed'
        );
        logger.info('Updated Emoji Removed record');
      } else if (event.subtype == "rename") {
        const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Emoji Changed') as any;
        const messagets = ts?.Messagets as string | undefined;
        let num = Number(ts?.Number ?? 0);
        const pubmes = ts?.PubMes as string | undefined;
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
        await dbRun(
          'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
          rep1.ts,
          num + 1,
          'Emoji Changed'
        );
        logger.info('Updated Emoji Changed record');
      }
      logger.info(event);
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('dnd_updated_user', async ({ event, client, logger }) => {
    try {
      if (event.dnd_status.dnd_enabled) {
        const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Dnd Set Active') as any;
        const start = event.dnd_status.next_dnd_start_ts
          ? new Date(event.dnd_status.next_dnd_start_ts * 1000)
          : null;
        const end = event.dnd_status.next_dnd_end_ts
          ? new Date(event.dnd_status.next_dnd_end_ts * 1000)
          : null;
        const startStr = start ? start.toLocaleString() : 'unknown';
        const endStr = end ? end.toLocaleString() : 'unknown';
        const messagets = ts?.Messagets as string | undefined;
        let num = Number(ts?.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user}> has turned on their Do Not Disturb\nStarts: ${startStr}\nEnds: ${endStr}!`,
          thread_ts: messagets,
        });
        await dbRun(
          'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
          rep1.ts,
          num + 1,
          'Dnd Set Active'
        );
        logger.info('Updated Dnd Set Active record');
      } else if (event.dnd_status.dnd_enabled == false) {
        const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Dnd Set Inactive') as any;
        const messagets = ts?.Messagets as string | undefined;
        let num = Number(ts?.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user}> has turned off their Do Not Disturb.`,
          thread_ts: messagets,
        });
        await dbRun(
          'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
          rep1.ts,
          num + 1,
          'Dnd Set Inactive'
        );
        logger.info('Updated Dnd Set Inactive record');
      }
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('user_huddle_changed', async ({ event, client, logger }) => {
    try {
      if (event.user.profile.huddle_state == "in_a_huddle") {
        const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Huddle Joined') as any;
        const callId = (event.user.profile as any).huddle_state_call_id;
        const callInfo = callId ? ` (call ID: \`${callId}\`)` : "";
        const messagets = ts?.Messagets as string | undefined;
        let num = Number(ts?.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user.id}> has joined a huddle ${callInfo}!`,
          thread_ts: messagets,
        });
        await dbRun(
          'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
          rep1.ts,
          num + 1,
          'Huddle Joined'
        );
        logger.info('Updated Huddle Joined record');
      } else {
        const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Huddle Left') as any;
        let num = Number(ts?.Number ?? 0);
        const messagets = ts?.Messagets as string | undefined;
        const rep1 = await client.chat.postMessage({
          channel: "C09TXAZ8GAG",
          text: `<@${event.user.id}> has left a huddle.`,
          thread_ts: messagets,
        });
        await dbRun(
          'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
          rep1.ts,
          num + 1,
          'Huddle Left'
        );
        logger.info('Updated Huddle Left record');
      }
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });
};

export default { register };