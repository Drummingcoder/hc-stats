import type { App } from '@slack/bolt';

import { createClient } from "@libsql/client";

const privChannel = 'C09TXAZ8GAG'; 
const pubChannel = 'C09UH2LCP1Q';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});;

// Promisify database methods
const dbRun = async (sql: string, ...params: any[]) => {
  try {
    await turso.execute({
      sql: sql,
      args: params
    });
  } catch (err) {
    console.log(err);
  }
};

const dbGet = async (sql: string, ...params: any[]) => {
  try {
    const result = await turso.execute({
      sql: sql,
      args: params
    });

    return result.rows[0];
  } catch (err) {
    console.log(err);
  };
};

const dbAll = async (sql: string, ...params: any[]) => {
  try {
    const result = await turso.execute({
      sql: sql,
      args: params
    });

    return result.rows;
  } catch (err) {
    console.log(err);
  };
};

try {
  // 1. Create the table
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS Data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT DEFAULT (strftime('%Y-%m-%d', 'now')),
      Field TEXT UNIQUE NOT NULL,
      Messagets TEXT,
      Number INTEGER DEFAULT 0,
      PubMes TEXT
    )
  `);
  console.log('Database table "Data" ready');

  // 2. Define your initial fields
  const initialFields = [
    'New User', 'New Bot', 'New Workflow Bot', 'Channel Created',
    'Channel Archived', 'Channel Deleted', 'Channel Unarchived',
    'Channel Renamed', 'Subteam Added', 'Subteam Members Changed',
    'Subteam Changed', 'Subteam Deleted', 'Emoji Added',
    'Emoji Changed', 'Emoji Removed', 'Emoji Alias Added',
    'Dnd Set Active', 'Dnd Set Inactive', 'Huddle Joined', 'Huddle Left', 
    'File Created', 'File Shared', 'File Changed', 'File Deleted',
    'File Public', 'File Unshared', 'Username Changed', 'Real Name Changed', 'Display Name Changed',
    'User Deactivated', 'User Become Admin', 'User Become Owner', 'Change to MCG',
    'Change to SCG', 'Pronouns Changed', 'Emails Changed', 'Title Changed',
    'Phone Number Changed', 'Start Date Changed', 'Timezone Changed', 
    'Locale Changed', 'Status Text Changed', 'Status Emoji Changed',
    'Status Expiration Changed', 'Profile Image Change', 'User Reactivated',
    'Removed Admin', 'Removed Owner', 'Change to User'
  ];

  // 3. Use a Batch for Seeding
  // This sends all inserts in one single network request
  const statements = initialFields.map(field => ({
    sql: 'INSERT OR IGNORE INTO Data (Field, Number) VALUES (?, 0)',
    args: [field]
  }));

  await turso.batch(statements, "write");
  console.log('Database seeding complete');

} catch (err) {
  console.error('Error during database initialization:', err);
}

const register = (app: App) => {
  app.event('team_join', async ({ event, client, logger }: { event: any, client: any, logger: any }) => {
    try {
      logger.info(event.user);
      if (event.user.is_workflow_bot) {
        const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'New Workflow Bot') as any;
        const messagets = ts?.Messagets as string | undefined;
        let num = Number(ts?.Number ?? 0);
        const rep1 = await client.chat.postMessage({
          channel: privChannel,
          text: `<@${event.user.id}> the workflow bot has joined! Join type: ${event.type}`,
          thread_ts: messagets,
        });
        const pubmes = ts?.PubMes as string | undefined;
        await client.chat.postMessage({
          channel: pubChannel,
          text: `<@${event.user.id}> the workflow bot has joined! Join type: ${event.type}`,
          thread_ts: pubmes,
        });
        await client.chat.postMessage({
          channel: pubChannel,
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
          channel: privChannel,
          text: `<@${event.user.id}> the app has joined! Join type: ${event.type}`,
          thread_ts: messagets,
        });
        const pubmes = ts?.PubMes as string | undefined;
        await client.chat.postMessage({
          channel: pubChannel,
          text: `<@${event.user.id}> the app has joined! Join type: ${event.type}`,
          thread_ts: pubmes,
        });
        await client.chat.postMessage({
          channel: pubChannel,
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
          channel: privChannel,
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
        channel: privChannel,
        text: `<#${event.channel.id}> (${event.channel.name}) by <@${event.channel.creator}> has been created.`,
        thread_ts: messagets,
      });
      const pubmes = ts?.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: pubChannel,
        text: `<#${event.channel.id}> (${event.channel.name}) by <@${event.channel.creator}> has been created.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: pubChannel,
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
        channel: privChannel,
        text: `<#${event.channel}> was archived by <@${event.user}>.`,
        thread_ts: messagets,
      });
      const pubmes = ts?.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: pubChannel,
        text: `<#${event.channel}> was archived by <@${event.user}>.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: pubChannel,
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
        channel: privChannel,
        text: `<#${event.channel}> was deleted.`,
        thread_ts: messagets,
      });
      const pubmes = ts?.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: pubChannel,
        text: `<#${event.channel}> was deleted.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: pubChannel,
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
        channel: privChannel,
        text: `<#${event.channel.id}> (${event.channel.name}) was renamed.`,
        thread_ts: messagets,
      });
      const pubmes = ts?.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: pubChannel,
        text: `<#${event.channel.id}> (${event.channel.name}) was renamed.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: pubChannel,
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
        channel: privChannel,
        text: `<#${event.channel}> was unarchived by <@${event.user}>.`,
        thread_ts: messagets,
      });
      const pubmes = ts?.PubMes as string | undefined;
      await client.chat.postMessage({
        channel: pubChannel,
        text: `<#${event.channel}> was unarchived by <@${event.user}>.`,
        thread_ts: pubmes,
      });
      await client.chat.postMessage({
        channel: pubChannel,
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
        channel: privChannel,
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
        channel: privChannel,
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
          channel: privChannel,
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
          channel: privChannel,
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
            channel: privChannel,
            text: `:${event.name}: was added (alias of :${event.value.split(":")[1]}:)!`,
            thread_ts: messagets,
          });
          const pubmes = ts?.PubMes as string | undefined;
          await client.chat.postMessage({
            channel: pubChannel,
            text: `:${event.name}: was added (alias of :${event.value.split(":")[1]}:)!`,
            thread_ts: pubmes,
          });
          await client.chat.postMessage({
            channel: pubChannel,
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
            channel: privChannel,
            text: `:${event.name}: was added!`,
            thread_ts: messagets,
          });
          const pubmes = ts?.PubMes as string | undefined;
          await client.chat.postMessage({
            channel: pubChannel,
            text: `:${event.name}: was added!`,
            thread_ts: pubmes,
          });
          await client.chat.postMessage({
            channel: pubChannel,
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
          channel: privChannel,
          text: `${event.names} was removed.`,
          thread_ts: messagets,
        });
        const pubmes = ts?.PubMes as string | undefined;
        await client.chat.postMessage({
          channel: pubChannel,
          text: `${event.names} was removed.`,
          thread_ts: pubmes,
        });
        await client.chat.postMessage({
          channel: pubChannel,
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
          channel: privChannel,
          text: `${event.old_name} was renamed to ${event.new_name}.`,
          thread_ts: messagets,
        });
        await client.chat.postMessage({
            channel: pubChannel,
            text: `${event.old_name} was renamed to ${event.new_name}.`,
            thread_ts: pubmes,
          });
          await client.chat.postMessage({
            channel: pubChannel,
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
          channel: privChannel,
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
          channel: privChannel,
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
          channel: privChannel,
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
          channel: privChannel,
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

  app.event('file_created', async ({ event, client, logger }) => {
    try {
      const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'File Created') as any;
      const fileid = event.file.id;
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: privChannel,
        text: `File ${fileid} has been created.`,
        thread_ts: messagets,
      });
      await dbRun(
        'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
        rep1.ts,
        num + 1,
        'File Created'
      );
      logger.info('Updated File Created record');
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('file_shared', async ({ event, client, logger }) => {
    try {
      // Ignore files shared in the privChannel
      if (event.channel_id === privChannel) {
        logger.info(`Ignoring file_shared event in privChannel: ${event.file.id}`);
        return;
      }

      const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'File Shared') as any;
      const fileid = event.file.id;
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: privChannel,
        text: `File ${fileid} has been shared. Details:\n
        Channel: <#${event.channel_id}>\n
        User: <@${event.user_id}>
        `,
        thread_ts: messagets,
      });
      await dbRun(
        'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
        rep1.ts,
        num + 1,
        'File Shared'
      );
      logger.info('Updated File Shared record');
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('file_change', async ({ event, client, logger }) => {
    try {
      const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'File Changed') as any;
      const fileid = event.file.id;
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: privChannel,
        text: `File ${fileid} has been changed.`,
        thread_ts: messagets,
      });
      await dbRun(
        'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
        rep1.ts,
        num + 1,
        'File Changed'
      );
      logger.info('Updated File Changed record');
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('file_deleted', async ({ event, client, logger }) => {
    try {
      const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'File Deleted') as any;
      const fileid = event.file_id;
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: privChannel,
        text: `File ${fileid} has been deleted.`,
        thread_ts: messagets,
      });
      await dbRun(
        'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
        rep1.ts,
        num + 1,
        'File Deleted'
      );
      logger.info('Updated File Deleted record');
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('file_public', async ({ event, client, logger }) => {
    try {
      const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'File Public') as any;
      const fileid = event.file.id;
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: privChannel,
        text: `File ${fileid} has been made public.`,
        thread_ts: messagets,
      });
      await dbRun(
        'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
        rep1.ts,
        num + 1,
        'File Public'
      );
      logger.info('Updated File Public record');
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('file_unshared', async ({ event, client, logger }) => {
    try {
      const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'File Unshared') as any;
      const fileid = event.file.id;
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: privChannel,
        text: `File ${fileid} has been unshared.`,
        thread_ts: messagets,
      });
      await dbRun(
        'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
        rep1.ts,
        num + 1,
        'File Unshared'
      );
      logger.info('Updated File Unshared record');
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('user_change', async ({ event, client, logger }: { event: any, client: any, logger: any }) => {
    try {
      logger.info(event.user);
      const exist = await dbGet('SELECT * FROM users WHERE id = ?', event.user.id) as any;
      if (exist) {
        const existingObject = JSON.parse(exist.userobject);
        
        if (existingObject.name != event.user.name) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Username Changed') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: privChannel,
            text: `User <@${event.user.id}> has changed their username from ${existingObject.name} to ${event.user.name}.`,
            thread_ts: messagets,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Username Changed'
          );
          logger.info('Updated Username Changed record');
        }
        if (existingObject.profile.real_name != event.user.profile.real_name) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Real Name Changed') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: privChannel,
            text: `User <@${event.user.id}> has changed their real name from ${existingObject.profile.real_name} (${existingObject.profile.real_name_normalized}) to ${event.user.profile.real_name} (${event.user.profile.real_name_normalized}).`,
            thread_ts: messagets,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Real Name Changed'
          );
          logger.info('Updated Real Name Changed record');
        }
        if (existingObject.profile.display_name != event.user.profile.display_name) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Display Name Changed') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: privChannel,
            text: `User <@${event.user.id}> has changed their display name from ${existingObject.profile.display_name} (${existingObject.profile.display_name_normalized}) to ${event.user.profile.display_name} (${event.user.profile.display_name_normalized}).`,
            thread_ts: messagets,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Display Name Changed'
          );
          logger.info('Updated Display Name Changed record');
        }
        if (existingObject.deleted != event.user.deleted) {  
          if (event.user.deleted) {
            const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'User Deactivated') as any;
            const messagets = ts?.Messagets as string | undefined;
            let num = Number(ts?.Number ?? 0);
            const rep1 = await client.chat.postMessage({
              channel: privChannel,
              text: `User <@${event.user.id}> has been deactivated.`,
              thread_ts: messagets,
            });
            await dbRun(
              'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
              rep1.ts,
              num + 1,
              'User Deactivated'
            );
            logger.info('Updated User Deactivated record');
          } else {
            const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'User Reactivated') as any;
            const messagets = ts?.Messagets as string | undefined;
            let num = Number(ts?.Number ?? 0);
            const rep1 = await client.chat.postMessage({
              channel: privChannel,
              text: `User <@${event.user.id}> has been reactivated.`,
              thread_ts: messagets,
            });
            await dbRun(
              'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
              rep1.ts,
              num + 1,
              'User Reactivated'
            );
            logger.info('Updated User Reactivated record');
          }
        }
        if (existingObject.is_admin != event.user.is_admin) {
          if (event.user.is_admin) {
            const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'User Become Admin') as any;
            const messagets = ts?.Messagets as string | undefined;
            let num = Number(ts?.Number ?? 0);
            const rep1 = await client.chat.postMessage({
              channel: privChannel,
              text: `User <@${event.user.id}> has become an admin.`,
              thread_ts: messagets,
            });
            await dbRun(
              'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
              rep1.ts,
              num + 1,
              'User Become Admin'
            );
            logger.info('Updated User Become Admin record');
          } else {
            const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Removed Admin') as any;
            const messagets = ts?.Messagets as string | undefined;
            let num = Number(ts?.Number ?? 0);
            const rep1 = await client.chat.postMessage({
              channel: privChannel,
              text: `User <@${event.user.id}> has been removed as an admin.`,
              thread_ts: messagets,
            });
            await dbRun(
              'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
              rep1.ts,
              num + 1,
              'Removed Admin'
            );
            logger.info('Updated Removed Admin record');
          }
        }
        if (existingObject.is_owner != event.user.is_owner || existingObject.is_primary_owner != event.user.is_primary_owner) {
          if (event.user.is_owner || event.user.is_primary_owner) {
            const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'User Become Owner') as any;
            const messagets = ts?.Messagets as string | undefined;
            let num = Number(ts?.Number ?? 0);
            const rep1 = await client.chat.postMessage({
              channel: privChannel,
              text: `User <@${event.user.id}> has become an owner.`,
              thread_ts: messagets,
            });
            await dbRun(
              'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
              rep1.ts,
              num + 1,
              'User Become Owner'
            );
            logger.info('Updated User Become Owner record');
          } else {
            const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Removed Owner') as any;
            const messagets = ts?.Messagets as string | undefined;
            let num = Number(ts?.Number ?? 0);
            const rep1 = await client.chat.postMessage({
              channel: privChannel,
              text: `User <@${event.user.id}> has been removed as an owner.`,
              thread_ts: messagets,
            });
            await dbRun(
              'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
              rep1.ts,
              num + 1,
              'Removed Owner'
            );
            logger.info('Updated Removed Owner record');
          }
        }
        if (existingObject.is_restricted != event.user.is_restricted) {
          if (event.user.is_restricted) {
            const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Change to MCG') as any;
            const messagets = ts?.Messagets as string | undefined;
            let num = Number(ts?.Number ?? 0);
            const rep1 = await client.chat.postMessage({
              channel: privChannel,
              text: `User <@${event.user.id}> has become an Multi-Channel Guest.`,
              thread_ts: messagets,
            });
            await dbRun(
              'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
              rep1.ts,
              num + 1,
              'Change to MCG'
            );
            logger.info('Updated Change to MCG record');
          } else {
            const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Change to User') as any;
            const messagets = ts?.Messagets as string | undefined;
            let num = Number(ts?.Number ?? 0);
            const rep1 = await client.chat.postMessage({
              channel: privChannel,
              text: `User <@${event.user.id}> has become a member.`,
              thread_ts: messagets,
            });
            await dbRun(
              'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
              rep1.ts,
              num + 1,
              'Change to User'
            );
            logger.info('Updated Change to User record');
          }
        }
        if (existingObject.is_ultra_restricted != event.user.is_ultra_restricted) {
          if (event.user.is_ultra_restricted) {
            const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Change to SCG') as any;
            const messagets = ts?.Messagets as string | undefined;
            let num = Number(ts?.Number ?? 0);
            const rep1 = await client.chat.postMessage({
              channel: privChannel,
              text: `User <@${event.user.id}> has become a Single-Channel Guest.`,
              thread_ts: messagets,
            });
            await dbRun(
              'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
              rep1.ts,
              num + 1,
              'Change to SCG'
            );
            logger.info('Updated Change to SCG record');
          } else {
            const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Change to User') as any;
            const messagets = ts?.Messagets as string | undefined;
            let num = Number(ts?.Number ?? 0);
            const rep1 = await client.chat.postMessage({
              channel: privChannel,
              text: `User <@${event.user.id}> has become a member.`,
              thread_ts: messagets,
            });
            await dbRun(
              'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
              rep1.ts,
              num + 1,
              'Change to User'
            );
            logger.info('Updated Change to User record');
          }
        }
        if (existingObject.profile.pronouns != event.user.profile.pronouns) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Pronouns Changed') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: privChannel,
            text: `User <@${event.user.id}> changed their pronouns from ${existingObject.profile.pronouns} to ${event.user.profile.pronouns}.`,
            thread_ts: messagets,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Pronouns Changed'
          );
          logger.info('Updated Pronouns Changed record');
        }
        if (existingObject.profile.email != event.user.profile.email) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Emails Changed') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: privChannel,
            text: `User <@${event.user.id}> changed their email from ${existingObject.profile.email} to ${event.user.profile.email}.`,
            thread_ts: messagets,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Emails Changed'
          );
          logger.info('Updated Emails Changed record');
        }
        if (existingObject.profile.title != event.user.profile.title) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Title Changed') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: privChannel,
            text: `User <@${event.user.id}> changed their title from ${existingObject.profile.title} to ${event.user.profile.title}.`,
            thread_ts: messagets,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Title Changed'
          );
          logger.info('Updated Title Changed record');
        }
        if (existingObject.profile.phone != event.user.profile.phone) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Phone Number Changed') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: privChannel,
            text: `User <@${event.user.id}> changed their phone number from ${existingObject.profile.phone} to ${event.user.profile.phone}.`,
            thread_ts: messagets,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Phone Number Changed'
          );
          logger.info('Updated Phone Number Changed record');
        }
        if (existingObject.profile.start_date != event.user.profile.start_date) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Start Date Changed') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: privChannel,
            text: `User <@${event.user.id}> changed their start date from ${existingObject.profile.start_date} to ${event.user.profile.start_date}.`,
            thread_ts: messagets,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Start Date Changed'
          );
          logger.info('Updated Start Date Changed record');
        }
        if (existingObject.profile.tz != event.user.profile.tz) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Timezone Changed') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: privChannel,
            text: `User <@${event.user.id}> changed their timezone from ${existingObject.profile.tz} (${existingObject.profile.tz_label}) to ${event.user.profile.tz} (${event.user.profile.tz_label}).`,
            thread_ts: messagets,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Timezone Changed'
          );
          logger.info('Updated Timezone Changed record');
        }
        if (existingObject.locale != event.user.locale) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Locale Changed') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: privChannel,
            text: `User <@${event.user.id}> changed their locale from ${existingObject.locale} to ${event.user.locale}.`,
            thread_ts: messagets,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Locale Changed'
          );
          logger.info('Updated Locale Changed record');
        }
        if (existingObject.profile.avatar_hash != event.user.profile.avatar_hash) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Profile Image Change') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: privChannel,
            text: `User <@${event.user.id}> changed their profile image from ${existingObject.profile.image_512} to ${event.user.profile.image_512}.`,
            thread_ts: messagets,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Profile Image Change'
          );
          logger.info('Updated Profile Image Change record');
        }
        if (existingObject.profile.status_text != event.user.profile.status_text) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Status Text Changed') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: privChannel,
            text: `User <@${event.user.id}> changed their status text from ${existingObject.profile.status_text} to ${event.user.profile.status_text}.`,
            thread_ts: messagets,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Status Text Changed'
          );
          logger.info('Updated Status Text Changed record');
        }
        if (existingObject.profile.status_emoji != event.user.profile.status_emoji) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Status Emoji Changed') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: privChannel,
            text: `User <@${event.user.id}> changed their status emoji from ${existingObject.profile.status_emoji} to ${event.user.profile.status_emoji}.`,
            thread_ts: messagets,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Status Emoji Changed'
          );
          logger.info('Updated Status Emoji Changed record');
        }
        if (existingObject.profile.status_expiration != event.user.profile.status_expiration) {
          const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', 'Status Expiration Changed') as any;
          const messagets = ts?.Messagets as string | undefined;
          let num = Number(ts?.Number ?? 0);
          const rep1 = await client.chat.postMessage({
            channel: privChannel,
            text: `User <@${event.user.id}> changed their status expiration from ${existingObject.profile.status_expiration} to ${event.user.profile.status_expiration}.`,
            thread_ts: messagets,
          });
          await dbRun(
            'UPDATE Data SET Messagets = ?, Number = ? WHERE Field = ?',
            rep1.ts,
            num + 1,
            'Status Expiration Changed'
          );
          logger.info('Updated Status Expiration Changed record');
        }

        const userObject = JSON.stringify(event.user);
        await dbRun(
          'INSERT OR REPLACE INTO users (id, userobject) VALUES (?, ?)',
          event.user.id,
          userObject
        );
      } else {
        const userObject = JSON.stringify(event.user);
        await dbRun(
          'INSERT OR REPLACE INTO users (id, userobject) VALUES (?, ?)',
          event.user.id,
          userObject
        );
      }
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });
};

export default { register, turso, dbRun, dbGet, dbAll };