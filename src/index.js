import { config } from "./config/config.js";
import { handleCommand } from "./handlers/commandHandler.js";
import { startWhatsApp } from "./whatsapp.js";

console.log("🔥 FLAMMES BOT 🔥");
console.log("👑 Owner: Jobizzo Flammes");
console.log(`⚙️ Prefix: ${config.prefix}`);

const sock = await startWhatsApp();

sock.ev.on("messages.upsert", async ({ messages }) => {
  try {
    const message = messages[0];

    console.log("📩 MESSAGE RECEIVED");

    if (!message?.message || message.key.fromMe) {
      console.log("⚠️ Message ignored");
      return;
    }

    const text =
      message.message.conversation ||
      message.message.extendedTextMessage?.text ||
      "";

    console.log("📝 TEXT:", text);

    if (!text.startsWith(config.prefix)) {
      console.log("⚠️ Not a bot command");
      return;
    }

    const response = await handleCommand(
      text,
      message.key.remoteJid
    );

    console.log("🤖 RESPONSE:", response);

    await sock.sendMessage(message.key.remoteJid, {
      text: response
    });

    console.log("✅ RESPONSE SENT");
  } catch (error) {
    console.error("❌ MESSAGE ERROR:", error);
  }
});
