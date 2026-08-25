import { ping } from "../commands/ping.js";
import { menu } from "../commands/menu.js";
import { owner } from "../commands/owner.js";
import { help } from "../commands/help.js";
import { status } from "../commands/status.js";
import { license } from "../commands/license.js";
import { activate } from "../commands/activate.js";

export async function handleCommand(
  message,
  userId = "demo-user"
) {
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

    case ".status":
      return status(userId);

    case ".license":
      return license(userId);

    case ".activate":
      return activate(
        userId,
        process.env.CURRENT_USER_NUMBER
      );

    default:
      return "❌ Unknown command. Use .menu to see available commands.";
  }
}
