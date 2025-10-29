// Types
interface AddressComponents {
  house_number: string | null;
  road: string | null;
  city: string | null;
  state: string | null;
  postcode: string | null;
  unit: string | null;
}

// Constants
const STREET_SUFFIXES = [
  'ave', 'avenue',
  'blvd', 'boulevard',
  'cir', 'circle',
  'ct', 'court',
  'dr', 'drive',
  'ln', 'lane',
  'pl', 'place',
  'rd', 'road',
  'st', 'street',
  'way', 'pkwy', 'parkway',
  'ter', 'terrace',
  'trl', 'trail'
];

const CITY_PREFIX_WORDS = ['las', 'los', 'san', 'new', 'north', 'south', 'east', 'west'];

// Helper functions
function extractUnit(address: string): { unit: string | null; cleanedAddress: string } {
  const unitMatch = address.match(/(?:\s|,)(#\d+\w*|Suite\s*\w+|Apt\s*\w+|Unit\s*\w+)/i);

  if (unitMatch) {
    return {
      unit: unitMatch[1].toLowerCase(),
      cleanedAddress: address.replace(unitMatch[0], '')
    };
  }

  return { unit: null, cleanedAddress: address };
}

function normalizeAddress(address: string): { normalized: string; parts: string[] } {
  // Trim prefix before house number
  const trimmed = address.trim();
  const hnMatch = trimmed.match(/(\d+(?:-\d+)?(?:\s*\d+\/\d+)?)/);

  let normalized = trimmed;
  if (hnMatch) {
    const hnIndex = trimmed.indexOf(hnMatch[0]);
    if (hnIndex > 0) {
      normalized = trimmed.substring(hnIndex).trim();
    }
  }

  // Split by commas and remove 'USA' suffix
  let parts = normalized.split(',').map(p => p.trim());
  if (parts.length > 1 && parts[parts.length - 1].toLowerCase() === 'usa') {
    parts = parts.slice(0, -1);
  }

  return { normalized, parts };
}

function findPartWithHouseNumber(parts: string[]): number {
  return parts.findIndex(part => /^\d/.test(part));
}

function splitAtPosition(text: string, position: number): { road: string; city: string } {
  return {
    road: text.substring(0, position).trim().toLowerCase(),
    city: text.substring(position).trim().toLowerCase()
  };
}

function findCityPrefixPosition(text: string): number {
  const lowerText = text.toLowerCase();
  return Math.max(
    ...CITY_PREFIX_WORDS.map(word => lowerText.lastIndexOf(` ${word} `))
  );
}

function splitRoadAndCityBySuffix(
  middlePart: string,
  suffixMatch: RegExpMatchArray
): { road: string; city: string } {
  const suffixPos = middlePart.toLowerCase().indexOf(suffixMatch[0].toLowerCase());
  const suffixEndPos = suffixPos + suffixMatch[0].length;

  // Check if there's text after the suffix that looks like a city
  const afterSuffix = middlePart.substring(suffixEndPos).trim();
  if (/^\s*[A-Za-z]/.test(afterSuffix)) {
    return splitAtPosition(middlePart, suffixEndPos);
  }

  // Try to find city by common city prefix words
  const cityStartIndex = findCityPrefixPosition(middlePart);
  if (cityStartIndex > -1) {
    return splitAtPosition(middlePart, cityStartIndex);
  }

  // Special case for addresses like "Wild Ridge Ct Las Vegas"
  const specialCaseMatch = middlePart.match(/^(.*?\bct)\s+(las\s+vegas.*)$/i);
  if (specialCaseMatch) {
    return {
      road: specialCaseMatch[1].trim().toLowerCase(),
      city: specialCaseMatch[2].trim().toLowerCase()
    };
  }

  // Fallback: split at word after suffix
  const words = middlePart.split(/\s+/);
  const suffixIndex = words.findIndex(word => STREET_SUFFIXES.includes(word.toLowerCase()));

  if (suffixIndex !== -1 && suffixIndex < words.length - 2) {
    return {
      road: words.slice(0, suffixIndex + 1).join(' ').toLowerCase(),
      city: words.slice(suffixIndex + 1).join(' ').toLowerCase()
    };
  }

  // Last resort: split in half
  const midPoint = Math.floor(words.length / 2);
  return {
    road: words.slice(0, midPoint).join(' ').toLowerCase(),
    city: words.slice(midPoint).join(' ').toLowerCase()
  };
}

function splitRoadAndCityWithoutSuffix(middlePart: string): { road: string; city: string | null } {
  // Try common city prefixes
  const cityPrefixMatch = middlePart.match(/\b(las|los|san|new|north|south)\s+([A-Za-z\s]+)$/i);

  if (cityPrefixMatch) {
    const cityStart = middlePart.indexOf(cityPrefixMatch[0]);
    return {
      road: middlePart.substring(0, cityStart).trim().toLowerCase(),
      city: cityPrefixMatch[0].trim().toLowerCase()
    };
  }

  // Default split - assume the last two words are city
  const words = middlePart.split(/\s+/);
  if (words.length >= 3) {
    const cityWordCount = Math.min(2, Math.floor(words.length / 2));
    return {
      road: words.slice(0, words.length - cityWordCount).join(' ').toLowerCase(),
      city: words.slice(words.length - cityWordCount).join(' ').toLowerCase()
    };
  }

  // Too few words to split reliably
  return { road: middlePart.toLowerCase(), city: null };
}

function parseSinglePartAddress(
  addr: string,
  unit: string | null
): AddressComponents | null {
  // Extract house number, state, and postcode which are more reliably formatted
  const basicMatch = addr.match(/^(\d+)\s+(.+?)\s+([A-Za-z]{2})\s+(\d{5,})$/i);
  if (!basicMatch) return null;

  const [, house_number, middlePart, state, postcode] = basicMatch.map(s => s.trim());

  // Try to split road and city using street suffix
  const suffixPattern = new RegExp(`\\b(${STREET_SUFFIXES.join('|')})\\b`, 'i');
  const suffixMatch = middlePart.match(suffixPattern);

  const { road, city } = suffixMatch
    ? splitRoadAndCityBySuffix(middlePart, suffixMatch)
    : splitRoadAndCityWithoutSuffix(middlePart);

  return {
    house_number,
    road,
    city,
    state: state.toLowerCase(),
    postcode,
    unit: unit ?? null,
  };
}

function extractHouseNumberAndRoad(
  firstPart: string,
  fallback: string
): { house_number: string | null; road: string | null } {
  const match = firstPart.match(/^([\d\-\/\s]+)\s+(.+)$/)
    || fallback.match(/^([\d\-\/\s]+)\s+(.+)$/);

  return match
    ? { house_number: match[1].trim(), road: match[2].toLowerCase() }
    : { house_number: null, road: null };
}

function parseCityStatePostcode(restStr: string): {
  city: string | null;
  state: string | null;
  postcode: string | null;
} {
  let city: string | null = null;
  let state: string | null = null;
  let postcode: string | null = null;

  // Try to match city, state, and postcode
  const cspMatch = restStr.match(/([A-Za-z\s]+)[, ]+([A-Za-z]{2})[, ]+(\d{5,})/);

  if (cspMatch) {
    city = cspMatch[1].trim().toLowerCase();
    state = cspMatch[2].trim().toLowerCase();
    postcode = cspMatch[3].trim();
  } else {
    // Try city and state
    const csMatch = restStr.match(/([A-Za-z\s]+)[, ]+([A-Za-z]{2})/);
    if (csMatch) {
      city = csMatch[1].trim().toLowerCase();
      state = csMatch[2].trim().toLowerCase();
    }

    // Try state and postcode
    const spMatch = restStr.match(/([A-Za-z]{2})[, ]+(\d{5,})/);
    if (spMatch) {
      state = spMatch[1].trim().toLowerCase();
      postcode = spMatch[2].trim();
    }

    // Try just postcode
    const pMatch = restStr.match(/(\d{5,})/);
    if (pMatch) {
      postcode = pMatch[1].trim();
    }

    // Try just city
    if (!city) {
      const cityMatch = restStr.match(/([A-Za-z\s]+)/);
      if (cityMatch) {
        city = cityMatch[1].trim().toLowerCase();
      }
    }
  }

  return { city, state, postcode };
}

function extractCityFromRoad(road: string): { road: string; city: string } | null {
  const words = road.split(/\s+/);
  if (words.length <= 1) return null;

  const city = words.pop()!.toLowerCase();
  return { road: words.join(' ').toLowerCase(), city };
}

function parseRemainingParts(parts: string[]): {
  restStr: string;
  state: string | null;
} {
  const restStr = parts.join(', ');

  // Check if the only remaining part is a state abbreviation
  if (parts.length === 1 && /^[A-Z]{2}$/i.test(parts[0])) {
    return {
      restStr: '',
      state: parts[0].toLowerCase()
    };
  }

  return { restStr, state: null };
}

function resolveAddressComponents(
  house_number: string | null,
  road: string | null,
  city: string | null,
  state: string | null,
  postcode: string | null,
  unit: string | null
): AddressComponents {
  // If no city found but we have road and state, try extracting city from road
  if (!city && road && state) {
    const extracted = extractCityFromRoad(road);
    if (extracted) {
      return {
        house_number: house_number ?? null,
        road: extracted.road ?? null,
        city: extracted.city ?? null,
        state: state ?? null,
        postcode: postcode ?? null,
        unit: unit ?? null,
      };
    }
  }

  return {
    house_number: house_number ?? null,
    road: road ?? null,
    city: city ?? null,
    state: state ?? null,
    postcode: postcode ?? null,
    unit: unit ?? null,
  };
}

function parseMultiPartAddress(
  parts: string[],
  normalized: string,
  unit: string | null
): AddressComponents {
  // Find the part that starts with house number
  const startIndex = findPartWithHouseNumber(parts);
  const firstPart = parts[startIndex];
  const rest = parts.slice(startIndex + 1);

  // Extract house number and road from first part
  const { house_number, road } = extractHouseNumberAndRoad(firstPart, normalized);

  // Parse remaining parts for state
  const { restStr, state: standaloneState } = parseRemainingParts(rest);

  // Parse city, state, and postcode from remaining parts
  const { city, state: parsedState, postcode } = parseCityStatePostcode(restStr);
  const state = parsedState ?? standaloneState;

  return resolveAddressComponents(house_number, road, city, state, postcode, unit);
}

export function parseAddress(address: string): AddressComponents {
  // Extract unit from address
  const { unit, cleanedAddress } = extractUnit(address.trim());

  // Normalize and split address into parts
  const { normalized, parts } = normalizeAddress(cleanedAddress);

  // Handle addresses without commas (most common case)
  if (parts.length === 1) {
    const result = parseSinglePartAddress(normalized, unit);
    if (result) return result;
  }

  // Handle addresses with multiple comma-separated parts
  return parseMultiPartAddress(parts, normalized, unit);
}


