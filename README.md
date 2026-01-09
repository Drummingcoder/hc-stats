# Snooper Knight bot
A bot that tracks new users coming into the Slack (although not publicly), new bots, new channels that are made (as well as archived, deleted, unarchived, and renamed), new emojis added (alias added too), emojis renamed and deleted, and displays them publicly at #hc-activity-logs on the Hack Club Slack!
## Description:
This bot tracks all manners of activity, new users and bots, new channels, channels archived, deleted, unarchived, renamed, new emojis added, new emoji aliases added, emojis renamed or deleted, people turning off their Do Not Disturb or turning it on, joining or leaving huddles, and displays the number of times those things happen daily in #hc-activity-logs. It also shows some of that activity publicly (although not all of it to comply with FD rules) as it happens, so you can see when a new channel is created or a channel is archived. This doesn't track private channels or new workflow bots (built with Workflow Builder) added to the Slack.

## Running the Bot Locally
This bot was made using the bolt.js, so to install and deploy it yourself,
you need to install the Slack CLI.

1. Clone the repository:
    ```bash
    git clone https://github.com/Drummingcoder/find-the-channel.git
    cd snooperknight
    ```
2. Running the bot:
    ```bash
    slack run
    ```

It's as easy as that!

## Video:
Uh no video cuz this bot isn't something you can really use, but you can see it in action.

This project uses the Slack Bolt SDK, which is licensed under the MIT License.