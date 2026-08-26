export default async function statusCommand(req, res) {
  return res.json({
    success: true,
    status: "online",
    message: "WhatsApp Bot is running"
  });
}
