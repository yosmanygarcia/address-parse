import { Words, Sequence } from './types';
import {
  USPS_I4_DIRECTIONALS,
  USPS_STREET_SUFFIXES,
  USPS_SECONDARY_UNIT_DESIGNATORS,
  STATES
} from './data';

export function extractPrimaryNumber(
  address: Words,
): Sequence | null {
  if (!address || address.length === 0) {
    return null
  }

  for (let i = 0; i < address.length; i++) {
    if (!/^\d+$/.test(address[i])) {
      continue;
    }

    return {
      value: [address[i]],
      start: i,
      end: i,
    };
  }

  return null
}

export function extractPredirectional(
  address: Words,
  primaryNumber: Sequence
): Sequence | null {
  const index = primaryNumber.end + 1;

  // No more words?
  if (index > address.length) {
    return null;
  }

  // Not a directional?
  if (!USPS_I4_DIRECTIONALS[address[index]]) {
    return null;
  }

  return {
    value: [address[index]],
    start: index,
    end: index,
  };
}

export function extractStreetNameAndSuffix(
  address: Words,
  primaryNumber: Sequence,
  predirectional: Sequence | null
): Sequence | null {
  // Start after predirectional if present, else after primaryNumber
  let start = predirectional ? predirectional.end + 1 : primaryNumber.end + 1;

  let lastSuffixIndex = -1;

  for (let i = start; i < address.length; i++) {
    const word = address[i];

    const suffix = USPS_STREET_SUFFIXES.find(s =>
      s.primary === word || s.common.includes(word) || s.standard === word
    );

    if (suffix) {
      lastSuffixIndex = i;
    }
  }

  if (lastSuffixIndex !== -1) {
    return {
      value: address.slice(start, lastSuffixIndex + 1),
      start: start,
      end: lastSuffixIndex,
    };
  }

  return null;
}

export function extractPostdirectional(
  address: Words,
  streetNameAndSuffix: Sequence
): Sequence | null {
  const index = streetNameAndSuffix.end + 1;

  if (index >= address.length) {
    return null;
  }

  const word = address[index];

  if (!USPS_I4_DIRECTIONALS[word]) {
    return null;
  }

  return {
    value: [word],
    start: index,
    end: index,
  };
}

export function extractDeliveryLine(address: Words): {
  primaryNumber: Sequence,
  predirectional: Sequence | null,
  streetNameAndSuffix: Sequence,
  postdirectional: Sequence | null,
  secondary: Sequence | null,
} | null {
  const secondary = extractSecondary(address);

  if (secondary) {
    // Remove secondary unit from address for delivery line extraction
    address = [
      ...address.slice(0, secondary.start),
      ...address.slice(secondary.end + 1),
    ];
  }

  const primaryNumber = extractPrimaryNumber(address);
  if (!primaryNumber) {
    return null;
  }

  const predirectional = extractPredirectional(address, primaryNumber);

  const streetNameAndSuffix = extractStreetNameAndSuffix(address, primaryNumber, predirectional);
  if (!streetNameAndSuffix) {
    return null;
  }

  const postdirectional = extractPostdirectional(address, streetNameAndSuffix);

  return {
    primaryNumber,
    predirectional,
    streetNameAndSuffix,
    postdirectional,
    secondary,
  }
}

export function extractCity(
  address: Words,
  streetNameAndSuffix: Sequence,
  postdirectional: Sequence | null,
  state: Sequence,
): Sequence | null {
  // Start after postdirectional if present, else after streetNameAndSuffix
  let start = postdirectional
    ? postdirectional.end + 1
    : streetNameAndSuffix.end + 1;

  // End before state
  let end = state.start - 1;

  if (start > end) {
    return null;
  }

  return {
    value: address.slice(start, end + 1),
    start: start,
    end: end,
  };
}

export function extractSecondary(
  address: Words
): Sequence | null {
  for (let i = 0; i < address.length; i++) {
    const word = address[i];

    // Not a word like "Apt", "Suite", etc.?
    if (!USPS_SECONDARY_UNIT_DESIGNATORS[word]) {
      continue;
    }

    // Return the secondary unit designator and the following word (unit number)
    return {
      value: address.slice(i, i + 2),
      start: i,
      end: i + 1,
    }
  }

  return null;
}

export function extractState(
  address: Words,
  streetNameAndSuffix: Sequence,
  postdirectional: Sequence | null
): Sequence | null {
  // Start after postdirectional if present, else after streetNameAndSuffix
  let start = postdirectional ? postdirectional.end + 1 : streetNameAndSuffix.end + 1;

  for (let i = start; i < address.length; i++) {
    const word = address[i];
    if (STATES[word]) {
      return {
        value: [word],
        start: i,
        end: i,
      };
    }

    // Check for multi-word states (e.g., "new york")
    if (i + 1 < address.length) {
      const twoWords = `${word} ${address[i + 1]}`;

      if (STATES[twoWords]) {
        return {
          value: [word, address[i + 1]],
          start: i,
          end: i + 1,
        };
      }
    }
  }

  return null;
}

export function extractZip(
  address: Words,
  state: Sequence
): Sequence | null {
  // Start after state
  let start = state.end + 1;

  const regex = /^\d{5}(-\d{4})?$/;

  for (let i = start; i < address.length; i++) {
    const word = address[i];

    if (!regex.test(word)) {
      continue;
    }

    return {
      value: [word],
      start: i,
      end: i,
    };
  }

  return null;
}

export const separate = (
  address: string
): string[] => {
  const rawWords = address.toLowerCase()
    .split(/[\s,]+/)
    .map(w => w.trim())
    .filter(w => w);

  const words: string[] = [];

  for (const word of rawWords) {
    words.push(...separateSecondary(word));
  }

  return words;
}

export function separateSecondary(word: string): string[] {
  for (const key of Object.keys(USPS_SECONDARY_UNIT_DESIGNATORS)) {
    if (
      word.startsWith(key) &&
      word.length > key.length
    ) {
      const value = word.slice(key.length);

      if (/^[#]?\w+$/.test(value)) {
        return [key, value];
      }
    }
  }
  return [word];
}
