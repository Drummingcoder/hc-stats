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

  const message = `Yesterday: \n
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
    `;
  await app.client.chat.postMessage({
    channel: privChannel,
    text: message,
  });
  await app.client.chat.postMessage({
    channel: pubChannel,
    text: message,
  });

  const privthreads = [
    {field: 'New User', text: `New users for today: `},
    {field: 'New Bot', text: `New bots for today: `},
    {field: 'Channel Created', text: `Channels created: `},
    {field: 'Channel Archived', text: `Channels archived: `},
    {field: 'Channel Deleted', text: `Channels deleted: `},
    {field: 'Channel Unarchived', text: `Channels unarchived: `},
    {field: 'Channel Renamed', text: `Channels renamed: `},
    {field: 'Subteam Added', text: `User groups added: `},
    {field: 'Subteam Changed', text: `User groups modified: `},
    {field: 'Subteam Deleted', text: `User groups deleted: `},
    {field: 'Emoji Added', text: `Emojis added: `},
    {field: 'Emoji Alias Added', text: `Emoji aliases added: `},
    {field: 'Emoji Changed', text: `Emojis edited: `},
    {field: 'Emoji Removed', text: `Emojis removed: `},
    {field: 'Dnd Set Active', text: `Do Not Disturb set to true: `},
    {field: 'Dnd Set Inactive', text: `Do Not Disturb set to false: `},
    {field: 'Huddle Joined', text: `Huddle joiners: `},
    {field: 'Huddle Left', text: `Huddle leavers: `},
    {field: 'File Created', text: `Files created: `},
    {field: 'File Shared', text: `Files shared: `},
    {field: 'File Changed', text: `Files changed: `},
    {field: 'File Deleted', text: `Files deleted: `},
    {field: 'File Public', text: `Files made public: `},
    {field: 'File Unshared', text: `Files unshared: `},
    {field: 'Username Changed', text: `Usernames changed: `},
    {field: 'Real Name Changed', text: `Real names changed: `},
    {field: 'Display Name Changed', text: `Display names changed: `},
    {field: 'User Deactivated', text: `User deactivated: `},
    {field: 'User Reactivated', text: `User reactivated: `},
    {field: 'User Become Admin', text: `User became admin: `},
    {field: 'Removed Admin', text: `User removed from admin: `},
    {field: 'User Become Owner', text: `User became owner: `},
    {field: 'Removed Owner', text: `User removed from owner: `},
    {field: 'Change to MCG', text: `User changed to MCG: `},
    {field: 'Change to SCG', text: `User changed to SCG: `},
    {field: 'Change to User', text: `User changed to member: `},
    {field: 'Pronouns Changed', text: `Pronouns changed: `},
    {field: 'Emails Changed', text: `Emails changed: `},
    {field: 'Title Changed', text: `Title changed: `},
    {field: 'Phone Number Changed', text: `Phone number changed: `},
    {field: 'Start Date Changed', text: `Start date changed: `},
    {field: 'Timezone Changed', text: `Timezone changed: `},
    {field: 'Status Text Changed', text: `Status text changed: `},
    {field: 'Status Emoji Changed', text: `Status emoji changed: `},
    {field: 'Status Expiration Changed', text: `Status expiration changed: `},
    {field: 'Profile Image Change', text: `Profile image changed: `}
  ];
  const pubthreads = [
    {field: 'New Bot', text: `New bots for today: `},
    {field: 'Channel Created', text: `Channels created: `},
    {field: 'Channel Archived', text: `Channels archived: `},
    {field: 'Channel Deleted', text: `Channels deleted: `},
    {field: 'Channel Unarchived', text: `Channels unarchived: `},
    {field: 'Channel Renamed', text: `Channels renamed: `},
    {field: 'Subteam Added', text: `User groups added: `},
    {field: 'Subteam Deleted', text: `User groups deleted: `},
    {field: 'Emoji Added', text: `Emojis added: `},
    {field: 'Emoji Alias Added', text: `Emoji aliases added: `},
    {field: 'Emoji Changed', text: `Emojis edited: `},
    {field: 'Emoji Removed', text: `Emojis removed: `},
    {field: 'User Deactivated', text: `User deactivated: `},
    {field: 'User Reactivated', text: `User reactivated: `},
    {field: 'Change to MCG', text: `User changed to MCG: `}
  ];

  const airtablePayload: { field: string; ts: any; number: number; channel: string; PubMes?: any}[] = [];
  for (const thread of privthreads) {
    const rep = await app.client.chat.postMessage({
      channel: privChannel,
      text: thread.text,
    });
    let repPub: { ts?: any; } | undefined = undefined;
    if (pubthreads.find(t => t.field === thread.field)) {
      repPub = await app.client.chat.postMessage({
        channel: pubChannel,
        text: thread.text,
      });
    }
    airtablePayload.push({
      field: thread.field,
      ts: rep.ts,
      number: 0,
      channel: privChannel,
      PubMes: repPub ? repPub.ts : undefined,
    });
  }

  for (const payload of airtablePayload) {
    await dbRun(
      'UPDATE Data SET Messagets = ?, Number = ?, PubMes = ? WHERE Field = ?',
      payload.ts,
      payload.number,
      payload.PubMes ?? null,
      payload.field
    );
  }
});

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

const intervalJob = setInterval(async () => {
  // Use casting if your dbGet return type is 'unknown'
  const state = await dbGet('SELECT * FROM cursor WHERE id = 0');
  
  if (state?.condition) {
    clearInterval(intervalJob);
    return;
  }
  let currentCursor: string | undefined = state?.cursor ? String(state.cursor) : undefined;
  
  try {
    console.log(`Running batch update. Starting cursor: ${currentCursor || 'beginning'}`);

    for (let i = 0; i < 15; i++) {
      const next = await app.client.users.list({ 
        limit: 1000, 
        cursor: currentCursor, 
        team_id: "T0266FRGM" 
      });
      
      // Capture members in a local variable for TS narrowing
      const members = next.members;

      if (members && members.length > 0) {
        // Build the batch query
        const placeholders = members.map(() => "(?, ?)").join(",");
        
        // Use 'as string' to satisfy the DB args type
        const values = members.flatMap(u => [
          u.id as string, 
          JSON.stringify(u)
        ]);
        
        await dbRun(
          `INSERT OR REPLACE INTO users (id, userobject) VALUES ${placeholders}`,
          ...values
        );
        console.log(`Successfully synced ${members.length} users.`);
      }

      // Move to next cursor
      currentCursor = next.response_metadata?.next_cursor;
      
      // Save progress to DB immediately
      await dbRun('UPDATE cursor SET cursor = ? WHERE id = 0', currentCursor || "");

      // If no more pages, mark as complete and exit loop
      if (!currentCursor) {
        await dbRun('UPDATE cursor SET condition = 1 WHERE id = 0');
        clearInterval(intervalJob);
        console.log("Full sync complete.");
        return; 
      }
    }
  } catch (err) { 
    console.error('Error in interval job:', err); 
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
