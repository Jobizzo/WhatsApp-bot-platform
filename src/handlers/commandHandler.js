export async function commandHandler(req, res) {
  try {
    const command = req.body?.command || req.query?.command;

    if (!command) {
      return res.status(400).json({
        success: false,
        error: "Command is required"
      });
    }

    return res.json({
      success: true,
      command,
      message: "Command received successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
