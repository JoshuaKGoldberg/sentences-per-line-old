const shared = require("markdownlint/lib/shared");

const isCapitalizedAlphabetCharacter = (char) => {
  const charCode = char.charCodeAt(0);

  return charCode >= "A".charCodeAt(0) && charCode <= "Z".charCodeAt(0);
};

const getNextIndexNotInCode = (line, i) => {
  if (line[i] !== "`") {
    return i;
  }

  i += 1;

  // Get to the inside of this inline code segment
  while (line[i] === "`") {
    i += 1;

    if (i === line.length) {
      return undefined;
    }
  }

  // Get to the end of the inline code segment
  while (true) {
    i = line.indexOf("`", i);

    if (i === -1) {
      return undefined;
    }

    if (line[i - 1] !== "\\") {
      break;
    }
  }

  while (line[i] === "`") {
    i += 1;

    if (i === line.length) {
      return undefined;
    }
  }

  return i;
};

const ignoredWords = [
  "ie",
  "i.e",
  "eg",
  "e.g",
  "etc",
  "ex",
]

const isAfterIgnoredWord = (line, i) => {
  for (const ignoredWord of ignoredWords) {
    if (ignoredWord === line.substring(i - ignoredWord.length, i).toLowerCase()) {
      return true;
    }
  }

  return false;
}

const visitLine = (line, lineIndex, onError) => {
  let i = 0;

  // Ignore headings
  if (/^\s*#/.test(line)) {
    return;
  }

  // Ignore any starting list number, e.g. "1. " or " 1. "
  if (/^\s*\d+\./.test(line)) {
    i = line.indexOf(".") + 1;
  }

  for (; i < line.length - 2; i += 1) {
    i = getNextIndexNotInCode(line, i);
    if (i === undefined || i >= line.length - 2) {
      return;
    }

    if (
      line[i] === "."
      && line[i + 1] === " "
      && isCapitalizedAlphabetCharacter(line[i + 2])
      && !isAfterIgnoredWord(line, i)
    ) {
      shared.addError(onError, lineIndex, null, line.substr(Math.max(0, i - 7), 14));
    }
  }
};

module.exports = {
  "names": [ "sentences-per-line" ],
  "description": "Each sentence should be on its own line",
  "tags": [ "sentences" ],
  "function": (params, onError) => {
    shared.makeTokenCache(params);
    let inFenceLine = false;

    shared.forEachLine((line, lineIndex) => {
      if (line.substring(0, 3) === "```") {
        inFenceLine = !inFenceLine;
        return;
      }

      if (inFenceLine) {
        return;
      }

      visitLine(line, lineIndex, onError);
    });
  }
};
