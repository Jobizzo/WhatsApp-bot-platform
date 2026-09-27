const groupSettings = new Map();

function getGroupSettings(groupId) {
  if (!groupSettings.has(groupId)) {
    groupSettings.set(groupId, {
      antilink: false,
      antibadword: false,
      antibadwordLanguage: "all",
      antibadwordLimit: 3,
      antibadwordWarning: true,
      locknoone: false,
      lockMode: "off"
    });
  }

  return groupSettings.get(groupId);
}

export function isGroup(groupId) {
  return groupId?.endsWith("@g.us");
}

export function getSetting(groupId, setting) {
  return getGroupSettings(groupId)[setting];
}

export function setSetting(groupId, setting, value) {
  const settings = getGroupSettings(groupId);
  settings[setting] = value;
  return settings;
}
