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
    "File Public", "File Unshared"
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
      let fileInfo;
      try {
        fileInfo = await client.files.info({ file: fileid });
      } catch (fileError: any) {
        if (fileError?.data?.error === 'file_not_found') {
          logger.warn(`File ${fileid} not found for file_created event`);
          return;
        }
        throw fileError;
      }
      if (!fileInfo?.file) {
        logger.warn('File info not available for file_created event');
        return;
      }
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: privChannel,
        text: `File ${fileInfo.file.name} has been created. Details:
        Channels: ${fileInfo.file.channels && fileInfo.file.channels.length > 0 ? fileInfo.file.channels.map((id: string) => `<#${id}>`).join(', ') : 'none'},
        User: ${fileInfo.file.user ? `<@${fileInfo.file.user}>` : 'unknown'},
        Id: ${fileInfo.file.id},
        Size: ${fileInfo.file.size} bytes,
        Title: ${fileInfo.file.title},
        Mimetype: ${fileInfo.file.mimetype},
        Url: ${fileInfo.file.url_private}
        `,
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
      let fileInfo;
      try {
        fileInfo = await client.files.info({ file: fileid });
      } catch (fileError: any) {
        if (fileError?.data?.error === 'file_not_found') {
          logger.warn(`File ${fileid} not found for file_shared event`);
          return;
        }
        throw fileError;
      }
      if (!fileInfo?.file) {
        logger.warn('File info not available for file_shared event');
        return;
      }
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: privChannel,
        text: `File ${fileInfo.file.name} has been shared. Details:
        Channel: ${event.channel_id ? `<#${event.channel_id}>` : 'unknown'}
        User: ${event.user_id ? `<@${event.user_id}>` : 'unknown'}
        Id: ${event.file.id},
        Size: ${fileInfo.file.size} bytes,
        Title: ${fileInfo.file.title},
        Mimetype: ${fileInfo.file.mimetype},
        Url: ${fileInfo.file.url_private}
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
      let fileInfo;
      try {
        fileInfo = await client.files.info({ file: fileid });
      } catch (fileError: any) {
        if (fileError?.data?.error === 'file_not_found') {
          logger.warn(`File ${fileid} not found for file_change event`);
          return;
        }
        throw fileError;
      }
      if (!fileInfo?.file) {
        logger.warn('File info not available for file_change event');
        return;
      }
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: privChannel,
        text: `File ${fileInfo.file.name} has been changed. Details:
        Channels: ${fileInfo.file.channels && fileInfo.file.channels.length > 0 ? fileInfo.file.channels.map((id: string) => `<#${id}>`).join(', ') : 'none'},
        User: ${fileInfo.file.user ? `<@${fileInfo.file.user}>` : 'unknown'},
        Id: ${event.file.id},
        Size: ${fileInfo.file.size} bytes,
        Title: ${fileInfo.file.title},
        Mimetype: ${fileInfo.file.mimetype},
        Url: ${fileInfo.file.url_private}
        `,
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
      let fileInfo;
      try {
        fileInfo = await client.files.info({ file: fileid });
      } catch (fileError: any) {
        if (fileError?.data?.error === 'file_not_found') {
          logger.warn(`File ${fileid} not found for file_public event`);
          return;
        }
        throw fileError;
      }
      if (!fileInfo?.file) {
        logger.warn('File info not available for file_public event');
        return;
      }
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: privChannel,
        text: `File ${fileInfo.file.name} has been made public. Details:
        Channels: ${fileInfo.file.channels && fileInfo.file.channels.length > 0 ? fileInfo.file.channels.map((id: string) => `<#${id}>`).join(', ') : 'none'},
        User: ${fileInfo.file.user ? `<@${fileInfo.file.user}>` : 'unknown'},
        Id: ${event.file.id},
        Size: ${fileInfo.file.size} bytes,
        Title: ${fileInfo.file.title},
        Mimetype: ${fileInfo.file.mimetype},
        Url: ${fileInfo.file.url_private}
        `,
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
      let fileInfo;
      try {
        fileInfo = await client.files.info({ file: fileid });
      } catch (fileError: any) {
        if (fileError?.data?.error === 'file_not_found') {
          logger.warn(`File ${fileid} not found for file_unshared event`);
          return;
        }
        throw fileError;
      }
      if (!fileInfo?.file) {
        logger.warn('File info not available for file_unshared event');
        return;
      }
      const messagets = ts?.Messagets as string | undefined;
      let num = Number(ts?.Number ?? 0);
      const rep1 = await client.chat.postMessage({
        channel: privChannel,
        text: `File ${fileInfo.file.name} with id ${event.file.id} has been unshared. Details:
        Channels: ${fileInfo.file.channels && fileInfo.file.channels.length > 0 ? fileInfo.file.channels.map((id: string) => `<#${id}>`).join(', ') : 'none'},
        User: ${fileInfo.file.user ? `<@${fileInfo.file.user}>` : 'unknown'},
        Size: ${fileInfo.file.size} bytes,
        Title: ${fileInfo.file.title},
        Mimetype: ${fileInfo.file.mimetype},
        Url: ${fileInfo.file.url_private}
        `,
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
};

export default { register, turso, dbRun, dbGet, dbAll };