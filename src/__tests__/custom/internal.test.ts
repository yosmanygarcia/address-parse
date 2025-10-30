import {
  extractSecondary,
  extractPrimaryNumber,
  extractPredirectional,
  extractStreetNameAndSuffix,
  extractPostdirectional,
  extractDeliveryLine,
  extractCity,
  extractState,
  extractZip,
  separate
} from '../../custom/internal';
import {expect} from '../util'
import {expect as baseExpect} from '@loopback/testlab'
import {
  dataForPrimaryNumber,
  dataForPredirectional,
  dataForStreetNameAndSuffix,
  dataForPostdirectional,
  dataForDeliveryLine,
  dataForCity,
  dataForSecondary,
  dataForStates,
  dataForZips
} from './data';

describe('primaryNumber', () => {
  let i = 0;

  dataForPrimaryNumber.forEach(({input, output}) => {
    i++;

    it(`Case ${i}`, () => {
      const result = extractPrimaryNumber(
        separate(input.address)
      );

      expect('primaryNumber', result, output);
    });
  });
});

describe('predirectional', () => {
  let i = 0;

  dataForPredirectional.forEach(({input, output}) => {
    i++;

    it(`Case ${i}`, () => {
      const address = separate(input.address);

      const primaryNumber = extractPrimaryNumber(
        address
      );

      if (!primaryNumber) {
        throw new Error('Primary number not found');
      }

      const result = extractPredirectional(
        address,
        primaryNumber
      );

      expect('predirectional', result, output);
    });
  });
});

describe('streetNameAndSuffix', () => {
  let i = 0;

  dataForStreetNameAndSuffix.forEach(({input, output}) => {
    i++;

    it(`Case ${i}`, () => {
      const address = separate(input.address);

      const primaryNumber = extractPrimaryNumber(
        address
      );

      if (!primaryNumber) {
        throw new Error('Primary number not found');
      }

      const predirectional = extractPredirectional(
        address,
        primaryNumber
      );

      const result = extractStreetNameAndSuffix(
        address,
        primaryNumber,
        predirectional
      );

      baseExpect(result).to.eql(output);
    });
  });
});

describe('postdirectional', () => {
  let i = 0;

  dataForPostdirectional.forEach(({input, output}) => {
    i++;

    it(`Case ${i}`, () => {
      const address = separate(input.address);

      const primaryNumber = extractPrimaryNumber(
        address
      );

      if (!primaryNumber) {
        throw new Error('Primary number not found');
      }

      const predirectional = extractPredirectional(
        address,
        primaryNumber
      );

      const streetNameAndSuffix = extractStreetNameAndSuffix(
        address,
        primaryNumber,
        predirectional
      );

      if (!streetNameAndSuffix) {
        throw new Error('Street name and suffix not found');
      }

      const result = extractPostdirectional(
        address,
        streetNameAndSuffix
      );

      expect('postdirectional', result, output);
    });
  });
});

describe('city', () => {
  let i = 0;

  dataForCity.forEach(({input, output}) => {
    i++;

    it(`Case ${i}`, () => {
      const address = separate(input.address);

      const primaryNumber = extractPrimaryNumber(
        address
      );

      if (!primaryNumber) {
        throw new Error('Primary number not found');
      }

      const predirectional = extractPredirectional(
        address,
        primaryNumber
      );

      const streetNameAndSuffix = extractStreetNameAndSuffix(
        address,
        primaryNumber,
        predirectional
      );

      if (!streetNameAndSuffix) {
        throw new Error('Street name and suffix not found');
      }

      const postdirectional = extractPostdirectional(
        address,
        streetNameAndSuffix
      );

      const state = extractState(
        address,
        streetNameAndSuffix,
        postdirectional
      );

      if (!state) {
        throw new Error('State not found');
      }

      const result = extractCity(
        address,
        streetNameAndSuffix,
        postdirectional,
        state
      );

      if (!result) {
        throw new Error('City not found');
      }

      expect('city', result['value'], output['city'] );
    });
  });
});

describe('deliveryLine', () => {
  let i = 0;

  dataForDeliveryLine.forEach(({input, output}) => {
    i++;

    it(`Case ${i}`, () => {
      const address = separate(input.address);

      const result = extractDeliveryLine(
        address,
      );

      if (!result) {
        throw new Error('Delivery line not found');
      }

      baseExpect(result['primaryNumber']['value']).to.eql(output['primaryNumber']);
    });
  });
});

describe('secondary', () => {
  let i = 0;

  dataForSecondary.forEach(({input, output}) => {
    i++;

    it(`Case ${i}`, () => {
      const address = separate(input.address);

      const result = extractSecondary(
        address
      );

      expect('secondary', result, output);
    });
  });
});

describe('state', () => {
  let i = 0;

  dataForStates.forEach(({input, output}) => {
    i++;

    it(`Case ${i}`, () => {
      const address = separate(input.address);

      const deliveryLine = extractDeliveryLine(
        address,
      );

      if (!deliveryLine) {
        throw new Error('Delivery line not found');
      }

      const result = extractState(
        address,
        deliveryLine.streetNameAndSuffix,
        deliveryLine.postdirectional
      );

      if (!result) {
        throw new Error('State not found');
      }

      expect('state', result['value'], output['state']);
    });
  });
});

describe('zip', () => {
  let i = 0;

  dataForZips.forEach(({input, output}) => {
    i++;

    it(`Case ${i}`, () => {
      const address = separate(input.address);

      const deliveryLine = extractDeliveryLine(
        address,
      );

      if (!deliveryLine) {
        throw new Error('Delivery line not found');
      }

      const state = extractState(
        address,
        deliveryLine.streetNameAndSuffix,
        deliveryLine.postdirectional
      );

      if (!state) {
        expect('zip', null, output['zip']);

        return;
      }

      const result = extractZip(
        address,
        state
      );

      if (!result) {
        expect('zip', null, output['zip']);

        return;
      }

      expect('zip', result['value'], output['zip']);
    });
  });
});
