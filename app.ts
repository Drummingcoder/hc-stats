import { App, LogLevel } from '@slack/bolt';
import 'dotenv/config';
import registerListeners from './listeners/index.ts';
import http from 'http';
import cron from 'node-cron';
import { DateTime } from 'luxon';
import events from './listeners/events/index.ts';

const { dbAll, dbRun, dbGet, turso } = events;

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
    Usernames changed: ${recordMap["Username Changed"]?.Number ?? 0}\n
    Real names changed: ${recordMap["Real Name Changed"]?.Number ?? 0}\n
    Display names changed: ${recordMap["Display Name Changed"]?.Number ?? 0}\n
    Users deactivated: ${recordMap["User Deactivated"]?.Number ?? 0}\n
    Users reactivated: ${recordMap["User Reactivated"]?.Number ?? 0}\n
    Users became admin: ${recordMap["User Become Admin"]?.Number ?? 0}\n
    Users removed from admin: ${recordMap["Removed Admin"]?.Number ?? 0}\n
    Users became owner: ${recordMap["User Become Owner"]?.Number ?? 0}\n
    Users removed from owner: ${recordMap["Removed Owner"]?.Number ?? 0}\n
    Changed to MCG: ${recordMap["Change to MCG"]?.Number ?? 0}\n
    Changed to SCG: ${recordMap["Change to SCG"]?.Number ?? 0}\n
    Changed to member: ${recordMap["Change to User"]?.Number ?? 0}\n
    Pronouns changed: ${recordMap["Pronouns Changed"]?.Number ?? 0}\n
    Emails changed: ${recordMap["Emails Changed"]?.Number ?? 0}\n
    Title changed: ${recordMap["Title Changed"]?.Number ?? 0}\n
    Phone number changed: ${recordMap["Phone Number Changed"]?.Number ?? 0}\n
    Start date changed: ${recordMap["Start Date Changed"]?.Number ?? 0}\n
    Timezone changed: ${recordMap["Timezone Changed"]?.Number ?? 0}\n
    Status text changed: ${recordMap["Status Text Changed"]?.Number ?? 0}\n
    Status emoji changed: ${recordMap["Status Emoji Changed"]?.Number ?? 0}\n
    Status expiration changed: ${recordMap["Status Expiration Changed"]?.Number ?? 0}\n
    Profile image changed: ${recordMap["Profile Image Change"]?.Number ?? 0}\n
    User added to workspace: ${recordMap["User Added to Workspace"]?.Number ?? 0}\n
    User removed from workspace: ${recordMap["User Deleted from Workspace"]?.Number ?? 0}\n
    `,
  });
  await app.client.chat.postMessage({
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
    Usernames changed: ${recordMap["Username Changed"]?.Number ?? 0}\n
    Real names changed: ${recordMap["Real Name Changed"]?.Number ?? 0}\n
    Display names changed: ${recordMap["Display Name Changed"]?.Number ?? 0}\n
    Users deactivated: ${recordMap["User Deactivated"]?.Number ?? 0}\n
    Users reactivated: ${recordMap["User Reactivated"]?.Number ?? 0}\n
    Users became admin: ${recordMap["User Become Admin"]?.Number ?? 0}\n
    Users removed from admin: ${recordMap["Removed Admin"]?.Number ?? 0}\n
    Users became owner: ${recordMap["User Become Owner"]?.Number ?? 0}\n
    Users removed from owner: ${recordMap["Removed Owner"]?.Number ?? 0}\n
    Changed to MCG: ${recordMap["Change to MCG"]?.Number ?? 0}\n
    Changed to SCG: ${recordMap["Change to SCG"]?.Number ?? 0}\n
    Changed to member: ${recordMap["Change to User"]?.Number ?? 0}\n
    Pronouns changed: ${recordMap["Pronouns Changed"]?.Number ?? 0}\n
    Emails changed: ${recordMap["Emails Changed"]?.Number ?? 0}\n
    Title changed: ${recordMap["Title Changed"]?.Number ?? 0}\n
    Phone number changed: ${recordMap["Phone Number Changed"]?.Number ?? 0}\n
    Start date changed: ${recordMap["Start Date Changed"]?.Number ?? 0}\n
    Timezone changed: ${recordMap["Timezone Changed"]?.Number ?? 0}\n
    Status text changed: ${recordMap["Status Text Changed"]?.Number ?? 0}\n
    Status emoji changed: ${recordMap["Status Emoji Changed"]?.Number ?? 0}\n
    Status expiration changed: ${recordMap["Status Expiration Changed"]?.Number ?? 0}\n
    Profile image changed: ${recordMap["Profile Image Change"]?.Number ?? 0}\n
    User added to workspace: ${recordMap["User Added to Workspace"]?.Number ?? 0}\n
    User removed from workspace: ${recordMap["User Deleted from Workspace"]?.Number ?? 0}\n
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
  const rep19 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Files created: `,
  });
  const rep20 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Files shared: `,
  });
  const rep21 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Files changed: `,
  });
  const rep22 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Files deleted: `,
  });
  const rep23 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Files made public: `,
  });
  const rep24 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Files unshared: `,
  });
  const rep25 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Usernames changed: `,
  });
  const rep26 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Real names changed: `,
  });
  const rep27 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Display names changed: `,
  });
  const rep28 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `User deactivated: `,
  });
  const rep47 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `User reactivated: `,
  });
  const rep29 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `User became admin: `,
  });
  const rep46 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `User removed from admin: `,
  });
  const rep30 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `User became owner: `,
  });
  const rep45 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `User removed from owner: `,
  });
  const rep31 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Change to MCG: `,
  });
  const rep32 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Change to SCG: `,
  });
  const rep44 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Change to member: `,
  });
  const rep33 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Pronouns changed: `,
  });
  const rep34 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Emails changed: `,
  });
  const rep35 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Title changed: `,
  });
  const rep36 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Phone number changed: `,
  });
  const rep37 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Start date changed: `,
  });
  const rep38 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Timezone changed: `,
  });
  const rep39 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Status text changed: `,
  });
  const rep41 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Status emoji changed: `,
  });
  const rep42 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Status expiration changed: `,
  });
  const rep43 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `Profile image changed: `,
  });
  const rep48 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `User added to workspace: `,
  });
  const rep49 = await app.client.chat.postMessage({
    channel: privChannel,
    text: `User removed from workspace: `,
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
    },
    {
      fields: { 
        "Field": "Username Changed", 
        "Messagets": rep25.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Real Name Changed",
        "Messagets": rep26.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Display Name Changed",
        "Messagets": rep27.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "User Deactivated",
        "Messagets": rep28.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "User Reactivated",
        "Messagets": rep47.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "User Become Admin",
        "Messagets": rep29.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Removed Admin",
        "Messagets": rep46.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "User Become Owner",
        "Messagets": rep30.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Removed Owner",
        "Messagets": rep45.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Change to MCG",
        "Messagets": rep31.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Change to SCG",
        "Messagets": rep32.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Change to User",
        "Messagets": rep44.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Pronouns Changed",
        "Messagets": rep33.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Emails Changed",
        "Messagets": rep34.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Title Changed",
        "Messagets": rep35.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Phone Number Changed",
        "Messagets": rep36.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Start Date Changed",
        "Messagets": rep37.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Timezone Changed",
        "Messagets": rep38.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Status Text Changed",
        "Messagets": rep39.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Status Emoji Changed",
        "Messagets": rep41.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Status Expiration Changed",
        "Messagets": rep42.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "Profile Image Change",
        "Messagets": rep43.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "User Added to Workspace",
        "Messagets": rep48.ts,
        "Number": 0
      }
    },
    {
      fields: {
        "Field": "User Deleted from Workspace",
        "Messagets": rep49.ts,
        "Number": 0
      }
    },
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

// Reset the cursor condition at 9:45 PM Pacific every day
cron.schedule('45 21 * * *', async () => {
  const now = DateTime.now().setZone('America/Los_Angeles');
  // Only reset if we're actually at 9:45 PM Pacific (handles DST)
  if (now.hour !== 9 || now.minute !== 45) return;
  
  console.log('Resetting cursor condition at 9:45 AM Pacific...');
  try {
    await dbRun(
      'UPDATE cursor SET condition = ?, cursor = ? WHERE id = ?',
      false,
      '',
      0
    );
    console.log('Cursor condition reset successfully');
  } catch (error) {
    console.error('Error resetting cursor condition:', error);
  }
});

// Cron job that runs every minute until a condition is met
const intervalJob = setInterval(async () => {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS cursor (
      id NUMBER PRIMARY KEY,
      cursor TEXT,
      condition BOOLEAN DEFAULT 0
    )
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id NUMBER PRIMARY KEY,
      userobject TEXT
    )
  `);
  
  // Initialize the row if it doesn't exist
  await dbRun(
    'INSERT OR IGNORE INTO cursor (id, cursor, condition) VALUES (?, ?, ?)',
    0,
    '',
    false
  );
  
  const conditionMet = await dbGet('SELECT * FROM cursor WHERE id = ?', 0) as any;
  
  if (conditionMet?.condition) {
    console.log('Condition met, stopping interval job');
    clearInterval(intervalJob);
    return;
  }
  
  try {
    console.log('Running minute interval job...');
    const teamid = "T0266FRGM";
    const get = await dbGet('SELECT * FROM cursor WHERE id = ?', 0) as any;
    let cursor = "";
    let done = true;
    if (get) {
      cursor = get.cursor;
    }
    for (let i = 0; i < 15 && done; i++) {
      const next = await app.client.users.list({
        limit: 1000,
        team_id: teamid,
        cursor: cursor,
      });

      if (next.members) {
        for (const user of next.members) {
          const userObject = JSON.stringify(user);
          await dbRun(
            'INSERT OR REPLACE INTO users (id, userobject) VALUES (?, ?)',
            user.id,
            userObject
          );
        }
      }

      if (next.response_metadata?.next_cursor) {
        cursor = next.response_metadata?.next_cursor;
        await dbRun(
          'UPDATE cursor SET cursor = ?, condition = ? WHERE id = ?',
          cursor,
          false,
          0
        );
      } else {
        done = false;
      }
    }

    if (!done) {
      await dbRun(
        'UPDATE cursor SET condition = ? WHERE id = ?',
        true,
        0
      );
    }
  } catch (error) {
    console.error('Error in interval job:', error);
  }
}, 60000);

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
