import {expect} from '../util'
import {data} from './data';
import {parseAddress} from '../../custom';

describe('custom', () => {
  data.forEach(({address, parsed}) => {
    it(address, () => {
      const result = parseAddress(address);

      expect('House number', result['house_number'], parsed['house_number']);
      expect('Road', result['road'], parsed['road']);
      expect('City', result['city'], parsed['city']);
      expect('State', result['state'], parsed['state']);
      expect('Postcode', result['postcode'], parsed['postcode']);
      expect('Unit', result['unit'], parsed['unit']);
    });
  });
});

