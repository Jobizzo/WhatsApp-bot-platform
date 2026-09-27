import { isGroup, getSetting, setSetting } from "../services/groupSettingsService.js";
import { kickUser, promoteUser, demoteUser } from "../services/adminService.js";
import { getStrikes, addStrike, resetStrikes } from "../services/badwordStrikeService.js";
import {
  muteUser,
  unmuteUser,
  isMuted,
  getMutedUsers
} from "../services/muteService.js";
function mentioned(m) {
  return m?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
}

function limit(g) {
  return getSetting(g, "antibadwordLimit") || 3;
}

export async function handleCommand(message, userId="demo-user", isOwner=false, sock=null, rawMessage=null) {
  const c = message.trim().toLowerCase();

  if (c === ".ping") return "🏓 FLAMMES BOT: Pong!";
  if (c === ".owner") return "👑 Owner: Jobizzo Flammes";

  if (c === ".status") {
    return `🔥 FLAMMES BOT STATUS

🟢 Bot: ONLINE
🟢 WhatsApp: CONNECTED
🛡️ Protection: AVAILABLE
🌍 Multilingual: AVAILABLE
👑 Owner: Jobizzo Flammes`;
}

  if (c === ".menu" || c === ".help") {
    return `🔥 FLAMMES BOT MENU

📌 GENERAL
.ping
.menu
.help
.owner
.status

🛡️ PROTECTION
.antilink on
.antilink off
.antilink status

.antibadword on
.antibadword off
.antibadword status
.antibadword lang
.antibadword lang all
.antibadword warning on
.antibadword warning off
.antibadword limit 3
.antibadword limit status

🔒 LOCK
.locknoone on
.locknoone off
.locknoone status
.lockmode all
.lockmode text
.lockmode media
.lockmode admins
.lockmode off
.lockmode status

👮 ADMIN
.kick @user
.promote @user
.demote @user
.admins

⚠️ WARNINGS
.warn @user
.warnings @user
.resetwarn @user

🔇 MUTE
.mute @user
.unmute @user
.muted

👥 GROUP
.tagall
.groupinfo

🔥 FLAMMES BOT`;
  }

  if (c === ".menu" || c === ".help") {
  }

  if (c.startsWith(".antilink")) {
    if (!isGroup(userId)) return "❌ Group command only.";
    if (!isOwner) return "⛔ Owner only.";

    if (c === ".antilink on") {
      setSetting(userId, "antilink", true);
      return "🛡️ ANTI-LINK ENABLED";
    }

    if (c === ".antilink off") {
      setSetting(userId, "antilink", false);
      return "🛡️ ANTI-LINK DISABLED";
    }

    if (c === ".antilink status") {
      return `🛡️ ANTI-LINK STATUS\n\n${getSetting(userId,"antilink") ? "🟢 ENABLED" : "🔴 DISABLED"}`;
    }
  }

  if (c.startsWith(".antibadword")) {
    if (!isGroup(userId)) return "❌ Group command only.";
    if (!isOwner) return "⛔ Owner only.";

    if (c === ".antibadword on") {
      setSetting(userId, "antibadword", true);
      return "🚫 ANTI-BADWORD ENABLED\n\n🌍 Multilingual protection is active.";
    }

    if (c === ".antibadword off") {
      setSetting(userId, "antibadword", false);
      return "🚫 ANTI-BADWORD DISABLED";
    }

    if (c === ".antibadword status") {
      return `🚫 ANTI-BADWORD STATUS\n\n${getSetting(userId,"antibadword") ? "🟢 ENABLED" : "🔴 DISABLED"}`;
    }

    if (c === ".antibadword lang") {
      return `🌍 LANGUAGES

en — English
sw — Swahili
fr — French
es — Spanish
pt — Portuguese
de — German
it — Italian
ar — Arabic
hi — Hindi
zh — Chinese
ja — Japanese
ko — Korean
ru — Russian`;
    }

    if (c.startsWith(".antibadword lang ")) {
      const lang = c.replace(".antibadword lang ","").trim();
      setSetting(userId, "antibadwordLanguage", lang);
      return lang === "all"
        ? "🌍 MULTILINGUAL MODE ENABLED"
        : `🌍 LANGUAGE SET: ${lang}`;
    }

    if (c === ".antibadword warning on") {
      setSetting(userId, "antibadwordWarning", true);
      return "⚠️ WARNINGS ENABLED";
    }

    if (c === ".antibadword warning off") {
      setSetting(userId, "antibadwordWarning", false);
      return "⚠️ WARNINGS DISABLED";
    }

    if (c.startsWith(".antibadword limit ")) {
      const n = Number(c.replace(".antibadword limit ","").trim());

      if (!Number.isInteger(n) || n < 1 || n > 100) {
        return "❌ Limit must be between 1 and 100.";
      }

      setSetting(userId, "antibadwordLimit", n);
      return `🚨 LIMIT SET TO ${n}\n\n👢 User will be removed at ${n}/${n}.`;
    }

    if (c === ".antibadword limit status") {
      return `🚨 CURRENT LIMIT: ${limit(userId)}`;
    }
  }

  if (c.startsWith(".locknoone")) {
    if (!isGroup(userId)) return "❌ Group command only.";
    if (!isOwner) return "⛔ Owner only.";

    if (c === ".locknoone on") {
      setSetting(userId, "locknoone", true);
      setSetting(userId, "lockMode", "all");
      return "🔒 GROUP LOCKDOWN ENABLED";
    }

    if (c === ".locknoone off") {
      setSetting(userId, "locknoone", false);
      setSetting(userId, "lockMode", "off");
      return "🔓 GROUP LOCKDOWN DISABLED";
    }

    if (c === ".locknoone status") {
      return `🔒 LOCKDOWN: ${getSetting(userId,"locknoone") ? "🟢 ON" : "🔴 OFF"}`;
    }
  }

  if (c.startsWith(".lockmode")) {
    if (!isGroup(userId)) return "❌ Group command only.";
    if (!isOwner) return "⛔ Owner only.";

    const mode = c.replace(".lockmode ","").trim();

    if (mode === "status") {
      return `🔐 LOCK MODE: ${getSetting(userId,"lockMode") || "off"}`;
    }

    if (!["all","text","media","admins","off"].includes(mode)) {
      return "❌ Invalid lock mode.";
    }

    setSetting(userId, "lockMode", mode);
    setSetting(userId, "locknoone", mode !== "off");

    return mode === "off"
      ? "🔓 LOCK MODE DISABLED"
      : `🔐 LOCK MODE: ${mode.toUpperCase()}`;
  }

  if (c.startsWith(".kick")) {
    if (!isGroup(userId)) return "❌ Group command only.";
    if (!isOwner) return "⛔ Owner only.";

    const users = mentioned(rawMessage);
    if (!users.length) return "❌ Mention a user.";

    for (const jid of users) await kickUser(sock, userId, jid);
    return `👢 REMOVED ${users.length} USER(S)`;
  }

  if (c.startsWith(".promote")) {
    if (!isGroup(userId)) return "❌ Group command only.";
    if (!isOwner) return "⛔ Owner only.";

    const users = mentioned(rawMessage);
    if (!users.length) return "❌ Mention a user.";

    for (const jid of users) await promoteUser(sock, userId, jid);
    return `👑 PROMOTED ${users.length} USER(S)`;
  }

  if (c.startsWith(".demote")) {
    if (!isGroup(userId)) return "❌ Group command only.";
    if (!isOwner) return "⛔ Owner only.";

    const users = mentioned(rawMessage);
    if (!users.length) return "❌ Mention a user.";

    for (const jid of users) await demoteUser(sock, userId, jid);
    return `👤 DEMOTED ${users.length} USER(S)`;
  }

  if (c.startsWith(".warn")) {
    if (!isGroup(userId)) return "❌ Group command only.";
    if (!isOwner) return "⛔ Owner only.";

    const users = mentioned(rawMessage);
    if (!users.length) return "❌ Mention a user.";

    const max = limit(userId);
    const result = [];

    for (const jid of users) {
      const n = addStrike(userId, jid);

      if (n >= max) {
        try {
          await kickUser(sock, userId, jid);
          resetStrikes(userId, jid);
          result.push(`👢 ${n}/${max} — USER REMOVED`);
        } catch {
          result.push(`⚠️ ${n}/${max} — KICK FAILED`);
        }
      } else {
        result.push(`⚠️ ${n}/${max}`);
      }
    }

    return `⚠️ WARNING ISSUED\n\n${result.join("\n")}`;
  }

  if (c.startsWith(".warnings")) {
    if (!isGroup(userId)) return "❌ Group command only.";
    if (!isOwner) return "⛔ Owner only.";

    const users = mentioned(rawMessage);
    if (!users.length) return "❌ Mention a user.";

    return users.map(jid =>
      `⚠️ WARNINGS: ${getStrikes(userId,jid)}/${limit(userId)}`
    ).join("\n");
  }

  if (c.startsWith(".resetwarn")) {
    if (!isGroup(userId)) return "❌ Group command only.";
    if (!isOwner) return "⛔ Owner only.";

    const users = mentioned(rawMessage);
    if (!users.length) return "❌ Mention a user.";

    for (const jid of users) resetStrikes(userId, jid);

    return "♻️ WARNINGS RESET";
  }
  if (c === ".tagall") {
    if (!isGroup(userId)) {
      return "❌ This command can only be used inside a group.";
    }

    if (!isOwner) {
      return "⛔ Only the bot owner can use this command.";
    }

    if (!sock) {
      return "❌ WhatsApp connection unavailable.";
    }

    try {
      const metadata = await sock.groupMetadata(userId);

      const participants = metadata.participants || [];

      if (!participants.length) {
        return "❌ No group members found.";
      }

      const mentions = participants.map(
        participant => participant.id
      );

      const text =
        `📢 TAG ALL\n\n` +
        `🔥 FLAMMES BOT is calling everyone!\n\n` +
        participants
          .map(
            participant => `@${participant.id.split("@")[0]}`
          )
          .join(" ");

      await sock.sendMessage(userId, {
        text,
        mentions
      });

      return "";
    } catch (error) {
      console.error("❌ TAGALL ERROR:", error);
      return "❌ Could not tag group members.";
    }
  }
  if (c === ".admins") {
    if (!isGroup(userId)) {
      return "❌ This command can only be used inside a group.";
    }

    if (!sock) {
      return "❌ WhatsApp connection unavailable.";
    }

    try {
      const metadata = await sock.groupMetadata(userId);

      const admins = (metadata.participants || []).filter(
        participant =>
          participant.admin === "admin" ||
          participant.admin === "superadmin"
      );

      if (!admins.length) {
        return "❌ No group admins found.";
      }

      const mentions = admins.map(
        participant => participant.id
      );

      const text =
        `👑 GROUP ADMINS\n\n` +
        admins
          .map(
            participant =>
              `@${participant.id.split("@")[0]}`
          )
          .join("\n");

      await sock.sendMessage(userId, {
        text,
        mentions
      });

      return "";
    } catch (error) {
      console.error("❌ ADMINS ERROR:", error);
      return "❌ Could not retrieve group admins.";
    }
  }

  if (c === ".groupinfo") {
    if (!isGroup(userId)) {
      return "❌ This command can only be used inside a group.";
    }

    if (!sock) {
      return "❌ WhatsApp connection unavailable.";
    }

    try {
      const metadata = await sock.groupMetadata(userId);

      const participants = metadata.participants || [];

      const admins = participants.filter(
        participant =>
          participant.admin === "admin" ||
          participant.admin === "superadmin"
      );

      return `📊 GROUP INFORMATION

👥 Name: ${metadata.subject || "Unknown"}
🆔 ID: ${userId}
👤 Members: ${participants.length}
👑 Admins: ${admins.length}
📅 Created: ${
        metadata.creation
          ? new Date(metadata.creation * 1000).toLocaleString()
          : "Unknown"
      }

🔥 FLAMMES BOT`;
    } catch (error) {
      console.error("❌ GROUPINFO ERROR:", error);
      return "❌ Could not retrieve group information.";
    }
  }
if (c === ".mute" || c.startsWith(".mute ")){
    if (!isGroup(userId)) {
      return "❌ This command can only be used inside a group.";
    }

    if (!isOwner) {
      return "⛔ Only the bot owner can use this command.";
    }

    const users = mentioned(rawMessage);

    if (!users.length) {
      return "❌ Mention a user.\n\nExample: .mute @user";
    }

    for (const jid of users) {
      muteUser(userId, jid);
    }

    return `🔇 USER MUTED

${users.length} user(s) have been muted.
Their messages will be handled by FLAMMES BOT.`;
  }

  if (c === ".unmute" || c.startsWith(".unmute ")) {
    if (!isGroup(userId)) {
      return "❌ This command can only be used inside a group.";
    }

    if (!isOwner) {
      return "⛔ Only the bot owner can use this command.";
    }

    const users = mentioned(rawMessage);

    if (!users.length) {
      return "❌ Mention a user.\n\nExample: .unmute @user";
    }

    for (const jid of users) {
      unmuteUser(userId, jid);
    }

    return `🔊 USER UNMUTED

${users.length} user(s) have been unmuted.`;
  }

  if (c === ".muted") {
    if (!isGroup(userId)) {
      return "❌ This command can only be used inside a group.";
    }

    if (!isOwner) {
      return "⛔ Only the bot owner can use this command.";
    }

    const users = getMutedUsers(userId);

    if (!users.length) {
      return "🔊 NO MUTED USERS";
    }

    const mentions = users;

    const text =
      `🔇 MUTED USERS\n\n` +
      users
        .map(jid => `@${jid.split("@")[0]}`)
        .join("\n");

    if (sock) {
      await sock.sendMessage(userId, {
        text,
        mentions
      });
    }

    return "";
  }

  return "❌ Unknown command. Type .help";
}
