const deathb = async ({ ack, respond, shortcut, logger }) => {
  try {
    await ack();
    const userId = shortcut.user.id;
    logger.info(JSON.stringify(shortcut, null, 2));
  } catch (error) {
    logger.error(error);
  }
};

export { deathb };
