import {strict as assert} from 'assert';
import postal from 'node-postal';
import {addressParse} from '@zerodep/address';



const expectedParseForNodePostal = [
  [
    {value: '100', component: 'house_number'},
    {value: 'e main st', component: 'road'},
  ],
  [
    {value: '1234', component: 'house_number'},
    {value: 'west 56th ave n', component: 'road'},
  ],
  [
    {value: '5253', component: 'house_number'},
    {value: 'n. 44th dr.', component: 'road'},
    {value: 'phoenix', component: 'city'},
    {value: 'az', component: 'state'},
  ],
  [
    {value: '742', component: 'house_number'},
    {value: 'evergreen terrace', component: 'road'},
    {value: 'apt 2b', component: 'unit'},
  ],
  [
    {value: '1600', component: 'house_number'},
    {value: 'pennsylvania ave nw', component: 'road'},
    {value: 'suite 400', component: 'unit'},
  ],
  [
    {value: '123', component: 'house_number'},
    {value: 'main st', component: 'road'},
    {value: '#4', component: 'unit'},
  ],
  [
    {value: 'po box 123', component: 'po_box'},
    {value: 'fargo', component: 'city'},
    {value: 'nd', component: 'state'},
    {value: '58102', component: 'postcode'},
  ],
  [
    {value: 'p o box 343', component: 'po_box'},
    {value: 'dallas', component: 'city'},
    {value: 'tx', component: 'state'},
  ],
  [
    {value: 'rr 2 box 152', component: 'road'},
    {value: 'ada', component: 'city'},
    {value: 'ok', component: 'state'},
    {value: '74820', component: 'postcode'},
  ],
  [
    {value: '12-14', component: 'house_number'},
    {value: 'main st', component: 'road'},
    {value: 'anytown', component: 'city'},
    {value: 'usa', component: 'country'},
  ],
  [
    {value: '1600', component: 'house_number'},
    {value: 'amphitheatre parkway', component: 'road'},
    {value: 'mountain view', component: 'city'},
    {value: 'ca', component: 'state'},
    {value: '94043', component: 'postcode'},
  ],
  [
    {value: '123', component: 'house_number'},
    {value: 'main st', component: 'road'},
    {value: 'denver', component: 'city'},
    {value: 'co', component: 'state'},
    {value: '80202', component: 'postcode'},
  ],
  [
    {value: '4567', component: 'house_number'},
    {value: 'elm st', component: 'road'},
    {value: 'apt 5', component: 'unit'},
    {value: 'brooklyn', component: 'city_district'},
    {value: 'ny', component: 'state'},
  ],
  [
    {value: '125', component: 'house_number'},
    {value: 'state route 50', component: 'road'},
    {value: 'mound house', component: 'city'},
    {value: 'nv', component: 'state'},
  ],
  [
    {value: 'c/o jane smith', component: 'road'},
    {value: '456', component: 'house_number'},
    {value: 'oak rd', component: 'road'},
    {value: 'memphis', component: 'city'},
    {value: 'tn', component: 'state'},
    {value: '38104', component: 'postcode'},
  ],
  [
    {value: 'the empire state building', component: 'house'},
    {value: '350', component: 'house_number'},
    {value: '5th ave', component: 'road'},
    {value: 'new york', component: 'city'},
    {value: 'ny', component: 'state'},
    {value: '10118', component: 'postcode'},
  ],
  [
    {value: '899', component: 'house_number'},
    {value: 'south columbus ave', component: 'road'},
    {value: 'mount vernon', component: 'city'},
    {value: 'ny', component: 'state'},
    {value: '10550', component: 'postcode'},
    {value: 'suite 102b', component: 'unit'},
  ],
  [
    {value: '123 1/2', component: 'house_number'},
    {value: 'main st', component: 'road'},
    {value: 'anytown', component: 'city'},
    {value: 'il', component: 'state'},
    {value: '60000', component: 'postcode'},
  ],
];

describe('node-postal', () => {
  addresses.forEach((address, idx) => {
    it(`parses "${address}"`, () => {
      assert.deepEqual(
        postal.parser.parse_address(address),
        expectedParseForNodePostal[idx],
      );
    });
  });
});

const expectedParseForZerodepAddress: Array<Record<string, any>> = [
  {
    city: undefined,
    countryIso2: 'ST',
    normalized: '100 E MAIN ST',
    secondary: undefined,
    source: '100 E Main St',
    stateAbbr: undefined,
    street: '100 E MAIN',
    zip: undefined,
    zipExt: undefined
  },
  {
    city: undefined,
    countryIso2: undefined,
    normalized: '1234 WEST 56TH AVE N',
    secondary: undefined,
    source: '1234 West 56th Ave N',
    stateAbbr: undefined,
    street: '1234 W 56TH AVE N',
    zip: undefined,
    zipExt: undefined
  },
  {
    city: 'PHOENIX',
    countryIso2: undefined,
    normalized: '5253 N 44TH DR PHOENIX AZ',
    secondary: undefined,
    source: '5253 N. 44th Dr., Phoenix, AZ',
    stateAbbr: 'AZ',
    street: '5253 N 44TH DR',
    zip: undefined,
    zipExt: undefined
  },
  {
    city: undefined,
    countryIso2: undefined,
    normalized: '742 EVERGREEN TERRACE APT 2B',
    secondary: 'APT 2B',
    source: '742 Evergreen Terrace Apt 2B',
    stateAbbr: undefined,
    street: '742 EVERGREEN TER',
    zip: undefined,
    zipExt: undefined
  },
  {
    city: undefined,
    countryIso2: undefined,
    normalized: '1600 PENNSYLVANIA AVE NW STE 400',
    secondary: 'STE 400',
    source: '1600 Pennsylvania Ave NW Suite 400',
    stateAbbr: undefined,
    street: '1600 PENNSYLVANIA AVE NW',
    zip: undefined,
    zipExt: undefined
  },
  {
    city: undefined,
    countryIso2: undefined,
    normalized: '123 MAIN ST #4',
    secondary: '#4',
    source: '123 Main St #4',
    stateAbbr: undefined,
    street: '123 MAIN ST',
    zip: undefined,
    zipExt: undefined
  },
  {
    city: 'FARGO',
    countryIso2: undefined,
    normalized: 'PO BOX 123 FARGO ND 58102',
    secondary: undefined,
    source: 'PO Box 123, Fargo, ND 58102',
    stateAbbr: 'ND',
    street: 'PO BOX 123',
    zip: '58102',
    zipExt: undefined
  },
  {
    city: 'DALLAS',
    countryIso2: undefined,
    normalized: 'PO BOX 343 DALLAS TX',
    secondary: undefined,
    source: 'P O BOX 343, Dallas, TX',
    stateAbbr: 'TX',
    street: 'PO BOX 343',
    zip: undefined,
    zipExt: undefined
  },
  {
    city: 'ADA',
    countryIso2: undefined,
    normalized: 'RR 2 BOX 152 ADA OK 74820',
    secondary: 'RR',
    source: 'RR 2 Box 152, Ada, OK 74820',
    stateAbbr: 'OK',
    street: '2 BOX 152',
    zip: '74820',
    zipExt: undefined
  },
  {
    city: 'ANYTOWN',
    countryIso2: 'US',
    normalized: '12-14 MAIN ST ANYTOWN USA',
    secondary: undefined,
    source: '12-14 Main St, Anytown, USA',
    stateAbbr: undefined,
    street: '12-14 MAIN ST',
    zip: undefined,
    zipExt: undefined
  },
  {
    city: undefined,
    countryIso2: undefined,
    normalized: '1600 AMPHITHEATRE PARKWAY MOUNTAIN VIEW CA 94043',
    secondary: undefined,
    source: '1600 Amphitheatre Parkway Mountain View CA 94043',
    stateAbbr: 'CA',
    street: '1600 AMPHITHEATRE PARKWAY MOUNTAIN VW',
    zip: '94043',
    zipExt: undefined
  },
  {
    city: 'DENVER',
    countryIso2: undefined,
    normalized: '123 MAIN ST DENVER CO 80202',
    secondary: undefined,
    source: '123 Main St,Denver,CO,80202',
    stateAbbr: 'CO',
    street: '123 MAIN ST',
    zip: '80202',
    zipExt: undefined
  },
  {
    city: 'BROOKLYN',
    countryIso2: undefined,
    normalized: '4567 ELM ST APT 5 BROOKLYN NY',
    secondary: 'APT 5',
    source: '4567 Elm St , Apt 5,Brooklyn, NY',
    stateAbbr: 'NY',
    street: '4567 ELM ST',
    zip: undefined,
    zipExt: undefined
  },
  {
    city: 'HOUSE',
    countryIso2: undefined,
    normalized: '125 STATE ROUTE 50 MOUND HOUSE NV',
    secondary: 'STATE',
    source: '125 State Route 50, Mound House, NV',
    stateAbbr: 'NV',
    street: 'ROUTE 50 MOUND',
    zip: undefined,
    zipExt: undefined
  },
  {
    city: 'MEMPHIS',
    countryIso2: undefined,
    normalized: 'C/O JANE SMITH 456 OAK RD MEMPHIS TN 38104',
    secondary: 'SMITH',
    source: 'c/o Jane Smith, 456 Oak Rd, Memphis, TN 38104',
    stateAbbr: 'TN',
    street: '456 OAK RD',
    zip: '38104',
    zipExt: undefined
  },
  {
    city: 'YORK',
    countryIso2: undefined,
    normalized: 'THE EMPIRE STATE BLDG 350 5TH AVE NEW YORK NY 10118',
    secondary: 'BLDG',
    source: 'The Empire State Building, 350 5th Ave, New York, NY 10118',
    stateAbbr: 'NY',
    street: '350 5TH AVE NEW',
    zip: '10118',
    zipExt: undefined
  },
  {
    city: undefined,
    countryIso2: undefined,
    normalized: '899 SOUTH COLUMBUS AVE MOUNT VERNON NY 10550 STE 102B',
    secondary: 'STE 102B',
    source: '899 South Columbus Ave, Mount Vernon, NY 10550 Suite 102B',
    stateAbbr: undefined,
    street: '899 S COLUMBUS AVE MT',
    zip: '10550',
    zipExt: undefined
  },
  {
    city: 'ANYTOWN',
    countryIso2: undefined,
    normalized: '123 1/2 MAIN ST ANYTOWN IL 60000',
    secondary: undefined,
    source: '123 1/2 Main St, Anytown, IL 60000',
    stateAbbr: 'IL',
    street: '123 1/2 MAIN ST',
    zip: '60000',
    zipExt: undefined
  }
];

describe('@zerodep/address', () => {
  addresses.forEach((address, idx) => {
    it(`parses "${address}"`, () => {
      assert.deepEqual(
        addressParse(address),
        expectedParseForZerodepAddress[idx],
      );
    });
  });
});
