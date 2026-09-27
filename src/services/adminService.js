export function isValidParticipant(jid) {
  return (
    typeof jid === "string" &&
    (
      jid.endsWith("@s.whatsapp.net") ||
      jid.endsWith("@lid")
    )
  );
}

export async function kickUser(sock, groupId, userId) {
  if (!isValidParticipant(userId)) {
    throw new Error("Invalid participant ID.");
  }

  return await sock.groupParticipantsUpdate(
    groupId,
    [userId],
    "remove"
  );
}

export async function promoteUser(sock, groupId, userId) {
  if (!isValidParticipant(userId)) {
    throw new Error("Invalid participant ID.");
  }

  return await sock.groupParticipantsUpdate(
    groupId,
    [userId],
    "promote"
  );
}

export async function demoteUser(sock, groupId, userId) {
  if (!isValidParticipant(userId)) {
    throw new Error("Invalid participant ID.");
  }

  return await sock.groupParticipantsUpdate(
    groupId,
    [userId],
    "demote"
  );
}
