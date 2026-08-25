import crypto from "node:crypto";

export const LIFETIME_PRICE_KES = 150;

export function generateLicense(userId) {
  const id = crypto.randomBytes(6).toString("hex").toUpperCase();

  return {
    licenseId: `FLM-${id}`,
    userId,
    type: "lifetime",
    priceKES: LIFETIME_PRICE_KES,
    activatedAt: Date.now(),
    expiresAt: null,
    active: true
  };
}

export function isLicenseActive(license) {
  return Boolean(
    license &&
    license.active === true &&
    license.type === "lifetime"
  );
}
