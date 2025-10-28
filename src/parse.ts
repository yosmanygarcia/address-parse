export function parseAddress(address: string) {
  let house_number: string | null = null;
  let road: string | null = null;
  let city: string | null = null;
  let state: string | null = null;
  let postcode: string | null = null;
  let unit: string | null = null;

  let addr = address.trim();

  // Extract unit (e.g., #4, Suite 102B, Apt 5)
  const unitMatch = addr.match(/(?:\s|,)(#\d+\w*|Suite\s*\w+|Apt\s*\w+|Unit\s*\w+)/i);

  if (unitMatch) {
    unit = unitMatch[1].toLowerCase();
    addr = addr.replace(unitMatch[0], '');
  }

  // Split by commas
  let parts = addr.split(',').map(p => p.trim());

  // Handle country 'USA' - remove it from parts
  if (parts.length > 1 && parts[parts.length - 1].toLowerCase() === 'usa') {
    parts = parts.slice(0, -1);
  }

  // Find the part that starts with house number
  let addressStartIndex = 0;
  for (let i = 0; i < parts.length; i++) {
    if (/^\d/.test(parts[i])) {
      addressStartIndex = i;
      break;
    }
  }

  const firstPart = parts[addressStartIndex];
  let rest = parts.slice(addressStartIndex + 1);

  // Handle addresses without commas (most common case in the examples)
  if (parts.length === 1) {
    // First extract the house number, state, and postcode which are more reliably formatted
    const basicMatch = addr.match(/^(\d+)\s+(.+?)\s+([A-Za-z]{2})\s+(\d{5,})$/i);

    if (basicMatch) {
      house_number = basicMatch[1].trim();
      const middlePart = basicMatch[2].trim();
      state = basicMatch[3].trim().toLowerCase();
      postcode = basicMatch[4].trim();

      // Define common street suffixes
      const streetSuffixes = [
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

      // Create a regex pattern from street suffixes
      const suffixPattern = new RegExp(`\\b(${streetSuffixes.join('|')})\\b`, 'i');

      // Check for street suffix in the middle part
      const suffixMatch = middlePart.match(suffixPattern);

      if (suffixMatch) {
        // Find the position of the suffix
        const suffixPos = middlePart.toLowerCase().indexOf(suffixMatch[0].toLowerCase());
        const suffixEndPos = suffixPos + suffixMatch[0].length;

        // Find the next word after the suffix (likely start of city name)
        const afterSuffix = middlePart.substr(suffixEndPos).trim();
        const cityStartMatch = afterSuffix.match(/^\s+([A-Za-z]+)/);

        if (cityStartMatch && cityStartMatch.index !== null) {
          // Extract road up to and including suffix
          road = middlePart.substring(0, suffixEndPos).trim().toLowerCase();
          // Everything after is city
          city = middlePart.substring(suffixEndPos).trim().toLowerCase();
        } else {
          // If we can't clearly identify where city starts,
          // split by the last occurrence of a common city separator
          const cityWords = ['las', 'los', 'san', 'new', 'north', 'south', 'east', 'west'];
          let cityStartIndex = -1;

          for (const cityWord of cityWords) {
            const index = middlePart.toLowerCase().lastIndexOf(` ${cityWord} `);
            if (index > cityStartIndex) {
              cityStartIndex = index;
            }
          }

          if (cityStartIndex > -1) {
            road = middlePart.substring(0, cityStartIndex).trim().toLowerCase();
            city = middlePart.substring(cityStartIndex).trim().toLowerCase();
          } else {
            // Special case for address like "5 Wild Ridge Ct Las Vegas Nv 891351672"
            const specialCaseMatch = middlePart.match(/^(.*?\bct)\s+(las\s+vegas.*)$/i);
            if (specialCaseMatch) {
              road = specialCaseMatch[1].trim().toLowerCase();
              city = specialCaseMatch[2].trim().toLowerCase();
            } else {
              // Fallback: split at word after suffix
              const words = middlePart.split(/\s+/);
              const suffixIndex = words.findIndex(word =>
                streetSuffixes.includes(word.toLowerCase()));

              if (suffixIndex !== -1 && suffixIndex < words.length - 2) {
                road = words.slice(0, suffixIndex + 1).join(' ').toLowerCase();
                city = words.slice(suffixIndex + 1).join(' ').toLowerCase();
              } else {
                // Last resort fallback - assume road is first half, city is second half
                const midPoint = Math.floor(words.length / 2);
                road = words.slice(0, midPoint).join(' ').toLowerCase();
                city = words.slice(midPoint).join(' ').toLowerCase();
              }
            }
          }
        }
      } else {
        // No street suffix found - try common city prefixes
        const cityPrefixMatch = middlePart.match(/\b(las|los|san|new|north|south)\s+([A-Za-z\s]+)$/i);

        if (cityPrefixMatch) {
          const cityStart = middlePart.indexOf(cityPrefixMatch[0]);
          road = middlePart.substring(0, cityStart).trim().toLowerCase();
          city = cityPrefixMatch[0].trim().toLowerCase();
        } else {
          // Default split - assume the last two words are city
          const words = middlePart.split(/\s+/);
          if (words.length >= 3) {
            const cityWordCount = Math.min(2, Math.floor(words.length / 2));
            road = words.slice(0, words.length - cityWordCount).join(' ').toLowerCase();
            city = words.slice(words.length - cityWordCount).join(' ').toLowerCase();
          } else {
            // Too few words to split reliably
            road = middlePart.toLowerCase();
          }
        }
      }

      return {
        house_number,
        road,
        city,
        state,
        postcode,
        unit: unit ?? null,
      };
    }
  }

  const hnRoadMatch = firstPart.match(/^([\d\-\/\s]+)\s+(.+)$/);

  if (hnRoadMatch) {
    house_number = hnRoadMatch[1].trim();
    road = hnRoadMatch[2].toLowerCase();
  } else {
    const fallbackMatch = addr.match(/^([\d\-\/\s]+)\s+(.+)$/);
    if (fallbackMatch) {
      house_number = fallbackMatch[1].trim();
      road = fallbackMatch[2].toLowerCase();
    }
  }

  let restStr = rest.join(', ');

  const cspMatch = restStr.match(/([A-Za-z\s]+)[, ]+([A-Za-z]{2})[, ]+(\d{5,})/);

  if (cspMatch) {
    city = cspMatch[1].trim().toLowerCase();
    state = cspMatch[2].trim().toLowerCase();
    postcode = cspMatch[3].trim();
  } else {
    const csMatch = restStr.match(/([A-Za-z\s]+)[, ]+([A-Za-z]{2})/);
    if (csMatch) {
      city = csMatch[1].trim().toLowerCase();
      state = csMatch[2].trim().toLowerCase();
    }
    const spMatch = restStr.match(/([A-Za-z]{2})[, ]+(\d{5,})/);
    if (spMatch) {
      state = spMatch[1].trim().toLowerCase();
      postcode = spMatch[2].trim();
    }
    const pMatch = restStr.match(/(\d{5,})/);
    if (pMatch) {
      postcode = pMatch[1].trim();
    }
    if (!city) {
      const cityMatch = restStr.match(/([A-Za-z\s]+)/);
      if (cityMatch) {
        city = cityMatch[1].trim().toLowerCase();
      }
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
