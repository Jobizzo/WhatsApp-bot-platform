import { findCustomer } from "../services/customerService.js";

export function license(userId) {
  const customer = findCustomer(userId);

  if (!customer) {
    return "❌ You don't have a registered account yet.";
  }

  if (customer.status !== "lifetime") {
    return `🔒 No lifetime license found.

Your current plan is: ${customer.status}

💎 Upgrade to lifetime access for KSh 150.`;
  }

  return `🔑 LIFETIME LICENSE

License ID: ${customer.licenseId}
Status: 🟢 ACTIVE
Plan: ♾️ LIFETIME
Price: KSh 150

👑 Jobizzo Flammes 🔥`;
}
