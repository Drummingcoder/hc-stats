const userjoin = async ({ client, event, logger }) => {
  try {
    const result = await client.chat.postMessage({
      channel: "C09TXAZ8GAG",
      text: `<@${event.user.id}>! has joined!`
    });
    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }
};

export { userjoin };