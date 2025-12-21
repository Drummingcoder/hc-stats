const deather = async ({ shortcut, ack, client, logger }) => {
  try {
    const { trigger_id } = shortcut;
    await ack();
    
  } catch (error) {
    logger.error(error);
  }
};

export { deather };
