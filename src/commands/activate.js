import crypto from "node:crypto";
import {
  findCustomer,
  createCustomer,
  activateLifetime
} from "../services/customerService.js";
import { generateLicense } from "../services/licenseService.js";

export function activate(userId, ownerNumber) {
  const configuredOwner = process.env.OWNER_NUMBER;

  if (!configuredOwner || ownerNumber !== configuredOwner) {
    return "⛔ Only the bot owner can activate licenses.";
  }

  let customer = findCustomer(userId);

  if (!customer) {
    customer = createCustomer(userId);
  }

  if (customer.status === "lifetime") {
    return `✅ This account already has lifetime access.

🔑 License: ${customer.licenseId}`;
  }

  const license = generateLicense(userId);

  const activated = activateLifetime(
    customer,
    license.licenseId
  );

  if (!activated) {
    return "❌ License activation failed.";
  }

  return `🎉 LIFETIME ACTIVATED!

👤 User: ${userId}
💎 Plan: LIFETIME
💰 Amount: KSh 150
🔑 License: ${license.licenseId}
♾️ Access: PERMANENT

🔥 Jobizzo Flammes`;
    }
