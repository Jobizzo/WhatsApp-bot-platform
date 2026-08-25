import { ping } from "../commands/ping.js";
import { menu } from "../commands/menu.js";
import { owner } from "../commands/owner.js";
import { help } from "../commands/help.js";

export async function handleCommand(message) {
  const [command] = message.trim().split(/\s+/);

  switch (command.toLowerCase()) {
    case ".ping":
      return ping();

    case ".menu":
      return menu();

    case ".owner":
      return owner();

    case ".help":
      return help();

    default:
      return "❌ Unknown command. Use .menu to see available commands.";
  }
  }
