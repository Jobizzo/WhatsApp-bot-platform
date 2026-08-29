export async function handleCommand(message, userId = "demo-user") {
  const command = message.trim().toLowerCase();

  if (command === ".ping") {
    return "🏓 FLAMMES BOT: Pong!";
  }

  if (command === ".menu") {
    return `🔥 FLAMMES BOT MENU

.ping
.menu
.owner
.help
.status

🆓 FLAMMES BOT — COMPLETELY FREE`;
  }

  if (command === ".owner") {
    return "👑 Owner: Jobizzo Flammes";
  }

  if (command === ".help") {
    return `🔥 FLAMMES BOT HELP

Available commands:

.ping
.menu
.owner
.help
.status

🆓 No subscription
🆓 No payment
🆓 Completely FREE`;
  }

  if (command === ".status") {
    return `🔥 FLAMMES BOT STATUS

🟢 Bot: ONLINE
🟢 WhatsApp: CONNECTED
🆓 Access: FREE
💳 Subscription: NONE
💰 Payment: NOT REQUIRED

👑 Owner: Jobizzo Flammes`;
  }

  return "❌ Unknown command. Type .help";
}
