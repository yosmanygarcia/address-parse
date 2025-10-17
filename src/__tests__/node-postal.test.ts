import postal, {PostalResult} from 'node-postal';
import {expect} from './util'
import {data} from './data';

describe('node-postal', () => {
  data.forEach(({address, parsed}) => {
    it(address, () => {
      const result = postal.parser.parse_address(address);

      const value = (data: Array<PostalResult>, key: string)=> {
        const item = data.find(d => d.component === key);

        return item ? item.value : null;
      }

      expect('House number', value(result, 'house_number'), parsed['house_number']);
      expect('Road', value(result, 'road'), parsed['road']);
      expect('City', value(result, 'city'), parsed['city']);
      expect('State', value(result, 'state'), parsed['state']);
      expect('Postcode', value(result, 'postcode'), parsed['postcode']);
      expect('Unit', value(result, 'unit'), parsed['unit']);
    });
  });
});

