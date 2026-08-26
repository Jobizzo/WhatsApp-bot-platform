import {
  generateLicense,
  LIFETIME_PRICE_KES
} from "../services/licenseService.js";

export function license(userId = "demo-user") {
  const license = generateLicense(userId);

  return `💎 FLAMMES BOT LICENSE

👤 User: ${userId}
🆔 License: ${license.licenseId}
📦 Plan: Lifetime
💰 Price: KSh ${LIFETIME_PRICE_KES}
✅ Status: Active

🔥 FLAMMES BOT
👑 Jobizzo Flammes`;
}
