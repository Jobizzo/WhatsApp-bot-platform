import { handleCommand } from "./handlers/commandHandler.js";

const userId = "254700000000";

const commands = [
  ".ping",
  ".owner",
  ".menu",
  ".help",
  ".status",
  ".license"
];

for (const command of commands) {
  const response = await handleCommand(command, userId);

  console.log(`\n> ${command}`);
  console.log(response);
}
