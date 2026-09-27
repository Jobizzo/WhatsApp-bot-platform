import { BAD_WORDS } from "../data/badWords.js";

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getWordsForLanguages(languages) {
  let selectedLanguages;

  if (!languages || languages === "all") {
    selectedLanguages = Object.keys(BAD_WORDS);
  } else if (Array.isArray(languages)) {
    selectedLanguages = languages;
  } else {
    selectedLanguages = [languages];
  }

  return selectedLanguages
    .filter((language) => BAD_WORDS[language])
    .flatMap((language) =>
      Object.values(BAD_WORDS[language]).flat()
    );
}

export function containsBadword(text, languages = "all") {
  if (!text) return false;

  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/);

  const badWords = getWordsForLanguages(languages);

  return badWords.some((badword) =>
    words.includes(badword.toLowerCase())
  );
}

export function getSupportedLanguages() {
  return Object.keys(BAD_WORDS);
}
