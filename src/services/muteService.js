const mutedUsers = new Map();

function getKey(groupId, userId) {
  return `${groupId}:${userId}`;
}

export function muteUser(groupId, userId) {
  mutedUsers.set(getKey(groupId, userId), true);
  return true;
}

export function unmuteUser(groupId, userId) {
  mutedUsers.delete(getKey(groupId, userId));
  return true;
}

export function isMuted(groupId, userId) {
  return mutedUsers.has(getKey(groupId, userId));
}

export function getMutedUsers(groupId) {
  const users = [];

  for (const key of mutedUsers.keys()) {
    if (key.startsWith(`${groupId}:`)) {
      users.push(key.substring(groupId.length + 1));
    }
  }

  return users;
}
