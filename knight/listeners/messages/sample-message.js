const sampleMessageCallback = async ({ context, say, logger }) => {
  try {
    await say(`how are you?`);
  } catch (error) {
    logger.error(error);
  }
};

export { sampleMessageCallback };
