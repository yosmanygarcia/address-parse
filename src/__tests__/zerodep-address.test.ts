import {addressParse} from '@zerodep/address';
import {expect} from './util'
import {data} from './data';

describe('@zerodep/address', () => {
  data.forEach(({address, parsed}) => {
    it(address, () => {
      const result = addressParse(address);

      expect('House number', result['secondary'], parsed['house_number']);
      expect('Road', result['street'], parsed['road']);
      expect('City', result['city'], parsed['city']);
      expect('State', result['stateAbbr'], parsed['state']);
      expect('Postcode', result['zip'], parsed['postcode']);
      expect('Unit', result['secondary'], parsed['unit']);
    });
  });
});

