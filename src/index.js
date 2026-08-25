import { config } from "./config/config.js";
import { handleCommand } from "./handlers/commandHandler.js";

console.log("🔥 FLAMMESBOT🔥");
console.log("👑 Owner: Jobizzo Flammes");
console.log(`⚙️ Prefix: ${config.prefix}`);
console.log("🚀 Bot foundation started!");

const testMessages = [
  ".ping",
  ".menu",
  ".owner",
  ".help"
];

for (const message of testMessages) {
  const response = await handleCommand(message);
  console.log(`\n> ${message}`);
  console.log(response);
}
