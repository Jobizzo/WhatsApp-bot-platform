import {
  findCustomer,
  createCustomer
} from "../services/customerService.js";

function formatTime(ms) {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor(
    (ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
  );

  return `${days} day(s), ${hours} hour(s)`;
}

export function status(userId) {
  let customer = findCustomer(userId);

  if (!customer) {
    customer = createCustomer(userId);
  }

  if (customer.status === "lifetime") {
    return `💎 ACCOUNT STATUS

👤 User: ${customer.userId}
🟢 Status: LIFETIME
♾️ Access: Unlimited
🔑 License: ${customer.licenseId}

🔥 Jobizzo Flammes`;
  }

  const remaining = customer.trialExpiresAt - Date.now();

  if (remaining <= 0) {
    return `⛔ TRIAL EXPIRED

Your 3-day free trial has ended.

💰 Lifetime Access: KSh 150
♾️ One-time payment`;
  }

  return `🆓 FREE TRIAL

👤 User: ${customer.userId}
🟢 Status: ACTIVE
⏳ Remaining: ${formatTime(remaining)}

💎 Lifetime Access: KSh 150`;
}
