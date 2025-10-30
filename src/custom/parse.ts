import {
  separate,
  extractDeliveryLine,
  extractCity,
  extractState,
  extractZip
} from './internal';

type Address = {
  house_number: string | null,
  road: string | null,
  city: string | null,
  state: string | null,
  postcode: string | null,
  unit: string | null,
};

export const parseAddress = (
  address: string
): Address => {
  const empty = {
    house_number: null,
    road: null,
    city: null,
    state: null,
    postcode: null,
    unit: null,
  }

  const words = separate(address);

  const deliveryLine = extractDeliveryLine(words);

  if (!deliveryLine) {
    return empty;
  }

  const state = extractState(
    words,
    deliveryLine.streetNameAndSuffix,
    deliveryLine.postdirectional,
  );

  if (!state) {
    return {
      house_number: deliveryLine.primaryNumber.value.join(' '),
      road: deliveryLine.streetNameAndSuffix.value.join(' '),
      city: null,
      state: null,
      postcode: null,
      unit: deliveryLine.secondary?.value.join(' ') || null,
    };
  }

  const city = extractCity(
    words,
    deliveryLine.streetNameAndSuffix,
    deliveryLine.postdirectional,
    state
  );

  if (!city) {
    return empty;
  }

  const zip = state
    ? extractZip(
      words,
      state
    )
    : null;

  return {
    house_number: deliveryLine.primaryNumber.value.join(' '),
    road: deliveryLine.streetNameAndSuffix.value.join(' '),
    city: city.value.join(' '),
    state: state.value.join(' '),
    postcode: zip ? zip.value.join(' ') : '',
    unit: deliveryLine.secondary?.value.join(' ') || '',
  }
}