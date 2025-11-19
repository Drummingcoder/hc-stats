const textback = async ({ message, say, logger }) => {
  console.log('textback invoked', { channel: message?.channel, user: message?.user, text: message?.text?.slice?.(0,200) });
  try {
    logger.info('received message', {
      channel: message?.channel,
      user: message?.user,
      subtype: message?.subtype,
      text: message?.text?.slice?.(0, 200),
    });

    if (!message?.text) return;
    if (message?.subtype === 'bot_message' || message?.bot_id) return;

    const userId = message.user || message.user?.id;
    if (!userId) {
      logger.warn('no user id', message);
      return;
    }

    await say(`Hello, <@${userId}>`);
  } catch (error) {
    logger.error(error);
  }
};

export { textback };