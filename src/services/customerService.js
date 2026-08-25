import fs from "node:fs";
import path from "node:path";

const databasePath = path.resolve("database/customers.json");

function readDatabase() {
  if (!fs.existsSync(databasePath)) {
    return { customers: [] };
  }

  return JSON.parse(fs.readFileSync(databasePath, "utf8"));
}

function writeDatabase(database) {
  fs.writeFileSync(
    databasePath,
    JSON.stringify(database, null, 2)
  );
}

export function findCustomer(userId) {
  const database = readDatabase();

  return database.customers.find(
    customer => customer.userId === userId
  );
}

export function createCustomer(userId) {
  const database = readDatabase();

  const existing = database.customers.find(
    customer => customer.userId === userId
  );

  if (existing) {
    return existing;
  }

  const customer = {
    userId,
    status: "trial",
    createdAt: Date.now(),
    trialStartedAt: Date.now(),
    trialExpiresAt: Date.now() + (3 * 24 * 60 * 60 * 1000),
    licenseId: null
  };

  database.customers.push(customer);
  writeDatabase(database);

  return customer;
}

export function activateLifetime(customer, licenseId) {
  const database = readDatabase();

  const index = database.customers.findIndex(
    item => item.userId === customer.userId
  );

  if (index === -1) {
    return null;
  }

  database.customers[index] = {
    ...database.customers[index],
    status: "lifetime",
    licenseId,
    activatedAt: Date.now()
  };

  writeDatabase(database);

  return database.customers[index];
    }
