import { config } from "./config/config.js";
import { handleCommand } from "./handlers/commandHandler.js";
import { startWhatsApp } from "./whatsapp.js";

import {
  isGroup,
  getSetting
} from "./services/groupSettingsService.js";

import { containsBadword } from "./services/antiBadwordService.js";

import {
  addStrike,
  resetStrikes
} from "./services/badwordStrikeService.js";

import { isMuted } from "./services/muteService.js";

console.log("🔥 FLAMMES BOT 🔥");
console.log("👑 Owner: Jobizzo Flammes");
console.log(`⚙️ Prefix: ${config.prefix}`);

const sock = await startWhatsApp();
const BOT_START_TIME = Math.floor(Date.now() / 1000);
async function isGroupAdmin(groupId, userId) {
  try {
    const metadata = await sock.groupMetadata(groupId);

    const participant = metadata.participants.find(
      p => p.id === userId || p.jid === userId
    );

    return (
      participant?.admin === "admin" ||
      participant?.admin === "superadmin"
    );
  } catch (error) {
    console.error("❌ ADMIN CHECK ERROR:", error);
    return false;
  }
}

sock.ev.on("messages.upsert", async ({ messages,type }) => {
  if (type !== "notify") {
    console.log("⏭️ MESSAGE HISTORY/SYNC IGNORED:", type);
    return;
  }

  try {
    for (const message of messages) {
const messageTimestamp =
  Number(message.messageTimestamp || 0);

if (
  messageTimestamp &&
  messageTimestamp < BOT_START_TIME
) {
  console.log(
    "⏭️ OLD MESSAGE IGNORED:",
    message.key.id
  );
  continue;
}
      if (!message?.message) continue;

      const chatId = message.key.remoteJid;

      const senderId =
        message.key.participant ||
        message.key.remoteJid;

      const isOwner =
        message.key.fromMe === true;

      const text =
        message.message.conversation ||
        message.message.extendedTextMessage?.text ||
        message.message.imageMessage?.caption ||
        message.message.videoMessage?.caption ||
        "";

      const cleanText = text.trim();

      if (!cleanText) continue;

// 🔇 MUTE ENFORCEMENT
if (
  isGroup(chatId) &&
  isMuted(chatId, senderId) &&
  !isOwner
) {
  try {
    await sock.sendMessage(chatId, {
      delete: message.key
    });

    console.log(
      "🔇 MUTED MESSAGE DELETED:",
      senderId
    );
  } catch (error) {
    console.error(
      "❌ MUTE DELETE ERROR:",
      error
    );
  }

  continue;
}
      console.log("📩 MESSAGE RECEIVED");
      console.log("📝 TEXT:", cleanText);

      // COMMANDS
      if (cleanText.startsWith(config.prefix)) {
        const response = await handleCommand(
          cleanText,
          chatId,
          isOwner,
          sock,
          message
        );

        console.log("🤖 RESPONSE:", response);

        if (response) {
          await sock.sendMessage(chatId, {
            text: response
          });

          console.log("✅ RESPONSE SENT");
        }

        continue;
      }

      // INDIVIDUAL MUTE
      if (
        isGroup(chatId) &&
        !isOwner &&
        isMuted(chatId, senderId)
      ) {
        console.log(
          "🔇 MUTED USER MESSAGE:",
          senderId
        );

        try {
          await sock.sendMessage(chatId, {
            delete: message.key
          });

          console.log(
            "🗑️ MUTED USER MESSAGE DELETED"
          );
        } catch (error) {
          console.error(
            "❌ MUTE DELETE ERROR:",
            error
          );
        }

        continue;
      }

      // GROUP CONTROLS
      if (isGroup(chatId)) {
        const lockEnabled =
          getSetting(
            chatId,
            "locknoone"
          );

        const lockMode =
          getSetting(
            chatId,
            "lockMode"
          );

        if (lockEnabled && !isOwner) {
          const senderIsAdmin =
            await isGroupAdmin(
              chatId,
              senderId
            );

          if (!senderIsAdmin) {
            let shouldDelete = false;

            if (lockMode === "all") {
              shouldDelete = true;
            }

            if (
              lockMode === "text" &&
              (
                message.message.conversation ||
                message.message.extendedTextMessage
              )
            ) {
              shouldDelete = true;
            }

            if (
              lockMode === "media" &&
              (
                message.message.imageMessage ||
                message.message.videoMessage ||
                message.message.audioMessage ||
                message.message.documentMessage ||
                message.message.stickerMessage
              )
            ) {
              shouldDelete = true;
            }

            if (lockMode === "admins") {
              shouldDelete = true;
            }

            if (shouldDelete) {
              try {
                await sock.sendMessage(chatId, {
                  delete: message.key
                });

                console.log(
                  "🔒 LOCKED MESSAGE DELETED"
                );
              } catch (error) {
                console.error(
                  "❌ LOCK DELETE ERROR:",
                  error
                );
              }

              continue;
            }
          }
        }
      }

      // ANTI-LINK
      if (
        isGroup(chatId) &&
        getSetting(
          chatId,
          "antilink"
        ) &&
        !isOwner
      ) {
        const linkPattern =
          /(https?:\/\/|www\.|t\.me\/|wa\.me\/)/i;

        if (
          linkPattern.test(cleanText)
        ) {
          console.log(
            "🔗 LINK DETECTED:",
            cleanText
          );

          try {
            await sock.sendMessage(
              chatId,
              {
                delete: message.key
              }
            );

            await sock.sendMessage(
              chatId,
              {
                text:
                  "🛡️ ANTI-LINK\n\n" +
                  "🚫 Links are not allowed in this group."
              }
            );
          } catch (error) {
            console.error(
              "❌ ANTI-LINK ERROR:",
              error
            );
          }

          continue;
        }
      }

      // ANTI-BADWORD
      if (
        isGroup(chatId) &&
        getSetting(
          chatId,
          "antibadword"
        ) &&
        !isOwner
      ) {
        const language =
          getSetting(
            chatId,
            "antibadwordLanguage"
          ) || "all";

        if (
          containsBadword(
            cleanText,
            language
          )
        ) {
          const strikes =
            addStrike(
              chatId,
              senderId
            );

          const limit =
            getSetting(
              chatId,
              "antibadwordLimit"
            ) || 3;

          console.log(
            `🚫 BADWORD: ${strikes}/${limit}`
          );

          try {
            await sock.sendMessage(
              chatId,
              {
                delete: message.key
              }
            );

            if (strikes >= limit) {
              await sock.groupParticipantsUpdate(
                chatId,
                [senderId],
                "remove"
              );

              await sock.sendMessage(
                chatId,
                {
                  text:
                    `🚫 ANTI-BADWORD\n\n` +
                    `👤 User reached ${limit} offenses.\n` +
                    `👢 User has been removed from the group.`
                }
              );

              resetStrikes(
                chatId,
                senderId
              );
            } else if (
              getSetting(
                chatId,
                "antibadwordWarning"
              )
            ) {
              await sock.sendMessage(
                chatId,
                {
                  text:
                    `⚠️ ANTI-BADWORD WARNING\n\n` +
                    `👤 Offense: ${strikes}/${limit}\n` +
                    `🚫 Inappropriate language is not allowed.\n\n` +
                    `⚠️ ${limit - strikes} offense(s) remaining before removal.`
                }
              );
            }
          } catch (error) {
            console.error(
              "❌ ANTI-BADWORD ERROR:",
              error
            );
          }

          continue;
        }
      }
    }
  } catch (error) {
    console.error(
      "❌ MESSAGE ERROR:",
      error
    );
  }
});
