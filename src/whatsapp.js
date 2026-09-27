import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";

import qrcode from "qrcode-terminal";

export async function startWhatsApp() {
  const { state, saveCreds } =
    await useMultiFileAuthState("./auth_info");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📱 Scan this QR code with WhatsApp:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ FLAMMES BOT connected to WhatsApp!");
    }

    if (connection === "close") {
      const statusCode =
        lastDisconnect?.error?.output?.statusCode;

      console.log(
        "❌ WhatsApp connection closed. Code:",
        statusCode
      );
console.log("🔍 DISCONNECT DETAILS:", lastDisconnect?.error);
      if (statusCode === DisconnectReason.loggedOut) {
        console.log(
          "🚪 WhatsApp logged out. Please authenticate again."
        );
      } else {
        console.log(
          "⚠️ Connection lost. Restart the bot to reconnect."
        );
      }
    }
  });

  return sock;
}
