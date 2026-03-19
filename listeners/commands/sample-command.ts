const sampleCommandCallback = async ({ ack, logger, client, command }) => {
  try {
    await ack();
    const pingChannel = 'C0AN1HZQF0R';

    try {
      await client.conversations.invite({
        channel: pingChannel,
        users: command.user_id,
      });
      await client.chat.postEphemeral({
        channel: command.channel_id,
        user: command.user_id,
        text: `You have been added to <#${pingChannel}>.`,
      });
      return;
    } catch (inviteError: any) {
      if (inviteError?.data?.error === 'already_in_channel') {
        await client.chat.postEphemeral({
          channel: command.channel_id,
          user: command.user_id,
          text: `You are already in <#${pingChannel}>.`,
        });
        return;
      }

      if (inviteError?.data?.error === 'not_in_channel') {
        // Ensure the bot joins the channel before retrying invite.
        await client.conversations.join({ channel: pingChannel });
        await client.conversations.invite({
          channel: pingChannel,
          users: command.user_id,
        });
        await client.chat.postEphemeral({
          channel: command.channel_id,
          user: command.user_id,
          text: `You have been added to <#${pingChannel}>.`,
        });
        return;
      }

      throw inviteError;
    }


  } catch (error) {
    logger.error(error);
  }
};

export { sampleCommandCallback };
