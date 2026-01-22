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
  const result = await turso.execute({
    sql: sql,
    args: params
  });
  return result;
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
    'Status Text Changed', 'Status Emoji Changed',
    'Status Expiration Changed', 'Profile Image Change', 'User Reactivated',
    'Removed Admin', 'Removed Owner', 'Change to User'
  ];

  const statements = initialFields.map(field => ({
    sql: 'INSERT OR IGNORE INTO Data (Field, Number) VALUES (?, 0)',
    args: [field]
  }));

  await turso.batch(statements, "write");
  console.log('Database seeding complete');

} catch (err) {
  console.error('Error during database initialization:', err);
}

const messandstore = async (client: any, field: string, message: string, channel: string, logger: any) => {
  try {
    const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', field) as any;
    const messagets = ts?.Messagets as string | undefined;
    let num = Number(ts?.Number ?? 0);
    await dbRun(
      'UPDATE Data SET Number = ? WHERE Field = ?',
      num + 1,
      field
    );
    await client.chat.postMessage({
      channel: channel,
      text: message,
      thread_ts: messagets,
    });
    
    logger.info(`Updated ${field} record`);
  } catch (error) {
    logger.error('Error handling message event', error);
  }
};

const publicMessage = async (client: any, field: string, message: string, channel: string, logger: any) => {
  try {
    const ts = await dbGet('SELECT * FROM Data WHERE Field = ?', field) as any;
    const pubmes = ts?.PubMes as string | undefined;
    await client.chat.postMessage({
      channel: channel,
      text: message,
      thread_ts: pubmes,
    });
    await client.chat.postMessage({
      channel: channel,
      text: message,
    });
  } catch (error) {
    logger.error('Error handling message event', error);
  }
}

const register = (app: App) => {
  app.event('team_join', async ({ event, client, logger }: { event: any, client: any, logger: any }) => {
    try {
      logger.info(event.user);
      const userObject = JSON.stringify(event.user);
      await dbRun(
        'INSERT OR REPLACE INTO users (id, userobject) VALUES (?, ?)',
        event.user.id,
        userObject
      );

      if (event.user.is_workflow_bot) {
        messandstore(client, 'New Workflow Bot', `<@${event.user.id}> the workflow bot has joined! Join type: ${event.type}`, privChannel, logger);
        publicMessage(client, 'New Workflow Bot', `<@${event.user.id}> the workflow bot has joined! Join type: ${event.type}`, pubChannel, logger);
        logger.info('Updated New Workflow Bot record');
      } else if (event.user.is_bot) {
        messandstore(client, 'New Bot', `<@${event.user.id}> the app has joined! Join type: ${event.type}`, privChannel, logger);
        publicMessage(client, 'New Bot', `<@${event.user.id}> the app has joined! Join type: ${event.type}`, pubChannel, logger);
        logger.info('Updated New Bot record');
      } else {
        messandstore(client, 'New User', 
          `<@${event.user.id}> has joined! Details:\n
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
          privChannel, logger);
      }
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('channel_created', async ({ event, client, logger }) => {
    messandstore(client, 'Channel Created', `<#${event.channel.id}> (${event.channel.name}) by <@${event.channel.creator}> has been created.`, privChannel, logger);
    publicMessage(client, 'Channel Created', `<#${event.channel.id}> (${event.channel.name}) by <@${event.channel.creator}> has been created.`, pubChannel, logger);
  });

  app.event('channel_archive', async ({ event, client, logger }) => {
    messandstore(client, 'Channel Archived', `<#${event.channel}> was archived by <@${event.user}>.`, privChannel, logger);
    publicMessage(client, 'Channel Archived', `<#${event.channel}> was archived by <@${event.user}>.`, pubChannel, logger);
  });

  app.event('channel_deleted', async ({ event, client, logger }) => {
    messandstore(client, 'Channel Deleted', `<#${event.channel}> was deleted.`, privChannel, logger);
    publicMessage(client, 'Channel Deleted', `<#${event.channel}> was deleted.`, pubChannel, logger);
  });

  app.event('channel_rename', async ({ event, client, logger }) => {
    messandstore(client, 'Channel Renamed', `<#${event.channel.id}> (${event.channel.name}) was renamed.`, privChannel, logger);
    publicMessage(client, 'Channel Renamed', `<#${event.channel.id}> (${event.channel.name}) was renamed.`, pubChannel, logger);
  });

  app.event('channel_unarchive', async ({ event, client, logger }) => {
    messandstore(client, 'Channel Unarchived', `<#${event.channel}> was unarchived by <@${event.user}>.`, privChannel, logger);
    publicMessage(client, 'Channel Unarchived', `<#${event.channel}> was unarchived by <@${event.user}>.`, pubChannel, logger);
  });

  app.event('subteam_created', async ({ event, client, logger }) => {
    let usersarray = "none";
    if (event.subteam.users && event.subteam.users.length > 0) {
      usersarray = event.subteam.users.map((id: any) => `<@${id}>`).join(', ');
    }

    let channelarray = "none";
    if (event.subteam.prefs?.channels && event.subteam.prefs.channels.length > 0) {
      channelarray = event.subteam.prefs.channels.map((id: any) => `<#${id}>`).join(', ');
    }
    messandstore(client, 'Subteam Added', `<!subteam^${event.subteam.id}> (${event.subteam.handle}) was made by <@${event.subteam.created_by}>. Details: \n
      Name: ${event.subteam.name}\n
      Users: ${usersarray}\n
      User count: ${event.subteam.user_count}\n
      Description: ${event.subteam.description}\n
      Channels: ${channelarray}\n
      Channel count: ${event.subteam.channel_count}
      `, privChannel, logger);
    publicMessage(client, 'Subteam Added', `<!subteam^${event.subteam.id}> (${event.subteam.handle}) was made by <@${event.subteam.created_by}>. Details: \n
      Name: ${event.subteam.name}\n
      Users: ${usersarray}\n
      User count: ${event.subteam.user_count}\n
      Description: ${event.subteam.description}\n
      Channels: ${channelarray}\n
      Channel count: ${event.subteam.channel_count}
      `, pubChannel, logger);
  });

  app.event('subteam_members_changed', async ({ event, client, logger }) => {
    let addarray = "none";
    if (event.added_users && event.added_users.length > 0) {
      addarray = event.added_users.map((id: any) => `<@${id}>`).join(', ');
    }

    let removedarray = "none";
    if (event.removed_users && event.removed_users.length > 0) {
      removedarray = event.removed_users.map((id: any) => `<@${id}>`).join(', ');
    }
    messandstore(client, 'Subteam Members Changed', `<!subteam^${event.subteam_id}> change was a member one:\n
      Added users: ${addarray}\n
      Added count: ${event.added_users_count}\n
      Deleted users: ${removedarray}\n
      Deleted count: ${event.removed_users_count}\n`, 
    privChannel, logger);
  });

  app.event('subteam_updated', async ({ event, client, logger }) => {
    let usersarray = "none";
    if (event.subteam.users && event.subteam.users.length > 0) {
      usersarray = event.subteam.users.map(id => `<@${id}>`).join(', ');
    }

    let channelarray = "none";
    if (event.subteam.prefs?.channels && event.subteam.prefs.channels.length > 0) {
      channelarray = event.subteam.prefs.channels.map(id => `<#${id}>`).join(', ');
    }
    
    if (event.subteam && 'deleted_by' in event.subteam && (event.subteam as any).deleted_by) {
      const thedate = event.subteam.date_create
        ? new Date(event.subteam.date_create * 1000)
        : null;
      const datestring = thedate ? thedate.toLocaleString() : 'unknown';
      messandstore(client, 'Subteam Deleted', `<!subteam^${event.subteam.id}> was deleted by <@${event.subteam.deleted_by}>. Details:\n
        Date created: ${datestring}\n
        Name: ${event.subteam.name}\n
        Handle: ${event.subteam.handle}\n
        Created by: <@${event.subteam.created_by}>\n
        Description: ${event.subteam.description}\n
        Members: ${usersarray}\n
        Member count: ${event.subteam.user_count}\n
        Channels: ${channelarray}\n
        Channel count: ${event.subteam.channel_count}`, 
      privChannel, logger);
      publicMessage(client, 'Subteam Deleted', `<!subteam^${event.subteam.id}> was deleted by <@${event.subteam.deleted_by}>. Details:\n
        Date created: ${datestring}\n
        Name: ${event.subteam.name}\n
        Handle: ${event.subteam.handle}\n
        Created by: <@${event.subteam.created_by}>\n
        Description: ${event.subteam.description}\n
        Members: ${usersarray}\n
        Member count: ${event.subteam.user_count}\n
        Channels: ${channelarray}\n
        Channel count: ${event.subteam.channel_count}
      `, pubChannel, logger);
    } else {
      const thedate = event.subteam.date_create
        ? new Date(event.subteam.date_create * 1000)
        : null;
      const datestring = thedate ? thedate.toLocaleString() : 'unknown';
      messandstore(client, 'Subteam Changed', `<!subteam^${event.subteam.id}> was updated by <@${event.subteam.updated_by}>. Details:\n
          Date created: ${datestring}\n
          Name: ${event.subteam.name}\n
          Created by: <@${event.subteam.created_by}>\n
          Description: ${event.subteam.description}\n
          Members: ${usersarray}\n
          Member count: ${event.subteam.user_count}\n
          Channels: ${channelarray}\n
          Channel count: ${event.subteam.channel_count}`, 
      privChannel, logger);
    }
  });

  app.event('emoji_changed', async ({ event, client, logger }) => {
    if (event.subtype == 'add') {
      if (event.value?.startsWith("alias")) {
        messandstore(client, 'Emoji Alias Added', `:${event.name}: was added (alias of :${event.value.split(":")[1]}:)!`, privChannel, logger);
        publicMessage(client, 'Emoji Alias Added', `:${event.name}: was added (alias of :${event.value.split(":")[1]}:)!`, pubChannel, logger);
      } else {
        messandstore(client, 'Emoji Added', `:${event.name}: was added!`, privChannel, logger);
        publicMessage(client, 'Emoji Added', `:${event.name}: was added!`, pubChannel, logger);
      }
    } else if (event.subtype == 'remove') {
      messandstore(client, 'Emoji Removed', `${event.names} was removed.`, privChannel, logger);
      publicMessage(client, 'Emoji Removed', `${event.names} was removed.`, pubChannel, logger);
    } else if (event.subtype == "rename") {
      messandstore(client, 'Emoji Changed', `${event.old_name} was renamed to ${event.new_name}.`, privChannel, logger);
      publicMessage(client, 'Emoji Changed', `${event.old_name} was renamed to ${event.new_name}.`, pubChannel, logger);
    }
  });

  app.event('dnd_updated_user', async ({ event, client, logger }) => {
    if (event.dnd_status.dnd_enabled) {
      const start = event.dnd_status.next_dnd_start_ts
          ? new Date(event.dnd_status.next_dnd_start_ts * 1000)
          : null;
      const end = event.dnd_status.next_dnd_end_ts
        ? new Date(event.dnd_status.next_dnd_end_ts * 1000)
        : null;
      const startStr = start ? start.toLocaleString() : 'unknown';
      const endStr = end ? end.toLocaleString() : 'unknown';
      messandstore(client, 'Dnd Set Active', `<@${event.user}> has turned on their Do Not Disturb\nStarts: ${startStr}\nEnds: ${endStr}!`, privChannel, logger);
    } else if (event.dnd_status.dnd_enabled == false) {
      messandstore(client, 'Dnd Set Inactive', `<@${event.user}> has turned off their Do Not Disturb.`, privChannel, logger);
    }
  });

  app.event('user_huddle_changed', async ({ event, client, logger }) => {
    if (event.user.profile.huddle_state == "in_a_huddle") {
      const callId = (event.user.profile as any).huddle_state_call_id;
      const callInfo = callId ? ` (call ID: \`${callId}\`)` : "";
      messandstore(client, 'Huddle Joined', `<@${event.user.id}> has joined a huddle ${callInfo}!`, privChannel, logger);
    } else {
      messandstore(client, 'Huddle Left', `<@${event.user.id}> has left a huddle.`, privChannel, logger);
    }
  });

  app.event('file_created', async ({ event, client, logger }) => {
    const fileid = event.file.id;
    messandstore(client, 'File Created', `File ${fileid} has been created.`, privChannel, logger);
  });

  app.event('file_shared', async ({ event, client, logger }) => {
    try {
      // Ignore files shared in the privChannel
      if (event.channel_id === privChannel) {
        logger.info(`Ignoring file_shared event in privChannel: ${event.file.id}`);
        return;
      }

      const chaninfo = await client.conversations.info({
        channel: event.channel_id
      });

      if (chaninfo.channel?.is_private || chaninfo.channel?.is_mpim || chaninfo.channel?.is_im || chaninfo.channel?.is_group) {
        return;
      }

      const fileid = event.file.id;
      messandstore(client, 'File Shared', `File ${fileid} has been shared. Details:\n
        Channel: <#${event.channel_id}>\n
        User: <@${event.user_id}>`, 
      privChannel, logger);
    } catch (error) {
      logger.error('Error handling message event', error);
    }
  });

  app.event('file_change', async ({ event, client, logger }) => {
    const fileid = event.file.id;
    messandstore(client, 'File Changed', `File ${fileid} has been changed.`, privChannel, logger);
  });

  app.event('file_deleted', async ({ event, client, logger }) => {
    const fileid = event.file.id;
    messandstore(client, 'File Deleted', `File ${fileid} has been deleted.`, privChannel, logger);
  });

  app.event('file_public', async ({ event, client, logger }) => {
    const fileid = event.file.id;
    messandstore(client, 'File Public', `File ${fileid} has been made public.`, privChannel, logger);
  });

  app.event('file_unshared', async ({ event, client, logger }) => {
    const fileid = event.file.id;
    messandstore(client, 'File Unshared', `File ${fileid} has been unshared.`, privChannel, logger);
  });

  app.event('user_change', async ({ event, client, logger }: { event: any, client: any, logger: any }) => {
    try {
      logger.info(event.user);
      const exist = await dbGet('SELECT * FROM users WHERE id = ?', event.user.id) as any;
      if (exist) {
        const existingObject = JSON.parse(exist.userobject);
        
        if (existingObject.name != event.user.name) {
          messandstore(client, 'Username Changed', `User <@${event.user.id}> has changed their username from ${existingObject.name} to ${event.user.name}.`, privChannel, logger);
        }
        if (existingObject.profile.real_name != event.user.profile.real_name) {
          messandstore(client, 'Real Name Changed', `User <@${event.user.id}> has changed their real name from ${existingObject.profile.real_name} (${existingObject.profile.real_name_normalized}) to ${event.user.profile.real_name} (${event.user.profile.real_name_normalized}).`, privChannel, logger);
        }
        if (existingObject.profile.display_name != event.user.profile.display_name) {
          messandstore(client, 'Display Name Changed', `User <@${event.user.id}> has changed their display name from ${existingObject.profile.display_name} (${existingObject.profile.display_name_normalized}) to ${event.user.profile.display_name} (${event.user.profile.display_name_normalized}).`, privChannel, logger);
        }
        if (existingObject.deleted != event.user.deleted) {  
          if (event.user.deleted) {
            messandstore(client, 'User Deactivated', `User <@${event.user.id}> has been deactivated.`, privChannel, logger);
            publicMessage(client, 'User Deactivated', `User <@${event.user.id}> has been deactivated.`, pubChannel, logger);
          } else {
            messandstore(client, 'User Reactivated', `User <@${event.user.id}> has been reactivated.`, privChannel, logger);
            publicMessage(client, 'User Reactivated', `User <@${event.user.id}> has been reactivated.`, pubChannel, logger);
          }
        }
        if (existingObject.is_admin != event.user.is_admin && event.user.deleted == false) {
          if (event.user.is_admin) {
            messandstore(client, 'User Become Admin', `User <@${event.user.id}> has become an admin.`, privChannel, logger);
          } else {
            messandstore(client, 'Removed Admin', `User <@${event.user.id}> has been removed as an admin.`, privChannel, logger);
          }
        }
        if ((existingObject.is_owner != event.user.is_owner || existingObject.is_primary_owner != event.user.is_primary_owner) && event.user.deleted == false) {
          if (event.user.is_owner || event.user.is_primary_owner) {
            messandstore(client, 'User Become Owner', `User <@${event.user.id}> has become an owner.`, privChannel, logger);
          } else {
            messandstore(client, 'Removed Owner', `User <@${event.user.id}> has been removed as an owner.`, privChannel, logger);
          }
        }
        if (existingObject.is_restricted != event.user.is_restricted && event.user.deleted == false) {
          if (event.user.is_restricted) {
            messandstore(client, 'Change to MCG', `User <@${event.user.id}> has become an Multi-Channel Guest.`, privChannel, logger);
            publicMessage(client, 'Change to MCG', `User <@${event.user.id}> has become an Multi-Channel Guest.`, pubChannel, logger);
          } else {
            messandstore(client, 'Change to User', `User <@${event.user.id}> has become a member.`, privChannel, logger);
          }
        }
        if (existingObject.is_ultra_restricted != event.user.is_ultra_restricted && event.user.deleted == false) {
          if (event.user.is_ultra_restricted) {
            messandstore(client, 'Change to SCG', `User <@${event.user.id}> has become an Single-Channel Guest.`, privChannel, logger);
          } else {
            messandstore(client, 'Change to User', `User <@${event.user.id}> has become a member.`, privChannel, logger);
          }
        }
        if (existingObject.profile.pronouns != event.user.profile.pronouns) {
          messandstore(client, 'Pronouns Changed', `User <@${event.user.id}> changed their pronouns from ${existingObject.profile.pronouns} to ${event.user.profile.pronouns}.`, privChannel, logger);
        }
        if (existingObject.profile.email != event.user.profile.email) {
          messandstore(client, 'Emails Changed', `User <@${event.user.id}> changed their email from ${existingObject.profile.email} to ${event.user.profile.email}.`, privChannel, logger);
        }
        if (existingObject.profile.title != event.user.profile.title) {
          messandstore(client, 'Title Changed', `User <@${event.user.id}> changed their title from ${existingObject.profile.title} to ${event.user.profile.title}.`, privChannel, logger);
        }
        if (existingObject.profile.phone != event.user.profile.phone) {
          messandstore(client, 'Phone Number Changed', `User <@${event.user.id}> changed their phone number from ${existingObject.profile.phone} to ${event.user.profile.phone}.`, privChannel, logger);
        }
        if (existingObject.profile.start_date != event.user.profile.start_date) {
          messandstore(client, 'Start Date Changed', `User <@${event.user.id}> changed their start date from ${existingObject.profile.start_date} to ${event.user.profile.start_date}.`, privChannel, logger);
        }
        if (existingObject.profile.tz != event.user.profile.tz) {
          messandstore(client, 'Timezone Changed', `User <@${event.user.id}> changed their timezone from ${existingObject.profile.tz} (${existingObject.profile.tz_label}) to ${event.user.profile.tz} (${event.user.profile.tz_label}).`, privChannel, logger);
        }
        if (existingObject.profile.avatar_hash != event.user.profile.avatar_hash) {
          const newImage = event.user.profile.image_original 
              || event.user.profile.image_512 
              || event.user.profile.image_192;

          const oldImage = existingObject.profile.image_original 
                        || existingObject.profile.image_512 
                        || "No previous image";
          messandstore(client, 'Profile Image Change', `User <@${event.user.id}> changed their profile image from ${oldImage} to ${newImage}.`, privChannel, logger);
        }
        if (existingObject.profile.status_text != event.user.profile.status_text) {
          messandstore(client, 'Status Text Changed', `User <@${event.user.id}> changed their status text from ${existingObject.profile.status_text} to ${event.user.profile.status_text}.`, privChannel, logger);
        }
        if (existingObject.profile.status_emoji != event.user.profile.status_emoji) {
          messandstore(client, 'Status Emoji Changed', `User <@${event.user.id}> changed their status emoji from ${existingObject.profile.status_emoji} to ${event.user.profile.status_emoji}.`, privChannel, logger);
        }
        if (existingObject.profile.status_expiration != event.user.profile.status_expiration) {
          messandstore(client, 'Status Expiration Changed', `User <@${event.user.id}> changed their status expiration from ${existingObject.profile.status_expiration} to ${event.user.profile.status_expiration}.`, privChannel, logger);
        }

        const userObject = JSON.stringify(event.user);
        await dbRun(
          'INSERT OR REPLACE INTO users (id, userobject) VALUES (?, ?)',
          event.user.id,
          userObject
        );
        logger.info(`Updated user object in database for user ${event.user.id}`);
      } else {
        const userObject = JSON.stringify(event.user);
        await dbRun(
          'INSERT OR REPLACE INTO users (id, userobject) VALUES (?, ?)',
          event.user.id,
          userObject
        );
        logger.info(`Inserted new user object in database for user ${event.user.id}`);
      }
    } catch (error) {
      logger.error('Error handling user_change event:', error);
      logger.error(`Failed to update database for user ${event.user?.id}`);
      
      try {
        await client.chat.postMessage({
          channel: privChannel,
          text: `⚠️ *Database Error*\nFailed to update user <@${event.user?.id}>\n\`\`\`${error}\`\`\``,
        });
      } catch (slackError) {
        logger.error('Failed to send error notification to Slack:', slackError);
      }
    }
  });
};

export default { register, turso, dbRun, dbGet, dbAll };