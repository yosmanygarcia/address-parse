export const data = [
  {
    address: '123 MAIN ST #4',
    parsed: {
      house_number: '123',
      road: 'main st',
      city: null,
      state: null,
      postcode: null,
      unit: '#4'
    }
  },
  {
    address: '899 South Columbus Ave, Mount Vernon, NY 10550 Suite 102B',
    parsed: {
      house_number: '899',
      road: 'south columbus ave',
      city: 'mount vernon',
      state: 'ny',
      postcode: '10550',
      unit: 'suite 102b'
    }
  },
  {
    address: '125 State Route 50, Mound House, NV',
    parsed: {
      house_number: '125',
      road: 'state route 50',
      city: 'mound house',
      state: 'nv',
      postcode: null,
      unit: null
    }
  },
  {
    address: '5253 N. 44th Dr., Phoenix, AZ',
    parsed: {
      house_number: '5253',
      road: 'n. 44th dr.',
      city: 'phoenix',
      state: 'az',
      postcode: null,
      unit: null
    }
  },
  {
    address: '12-14 Main St, Anytown, USA',
    parsed: {
      house_number: '12-14',
      road: 'main st',
      city: 'anytown',
      state: null,
      postcode: null,
      unit: null
    }
  },
  {
    address: '1600 Amphitheatre Parkway Mountain View CA 94043',
    parsed: {
      house_number: '1600',
      road: 'amphitheatre parkway',
      city: 'mountain view',
      state: 'ca',
      postcode: '94043',
      unit: null
    },
  },
  {
    address: '123 Main St,Denver,CO,80202',
    parsed: {
      house_number: '123',
      road: 'main st',
      city: 'denver',
      state: 'co',
      postcode: '80202',
      unit: null
    }
  },
  {
    address: '123 1/2 Main St, Anytown, IL 60000',
    parsed: {
      house_number: '123 1/2',
      road: 'main st',
      city: 'anytown',
      state: 'il',
      postcode: '60000',
      unit: null
    }
  },
  {
    address: 'At the North front entrance to the County Courthouse, 700 Civic Center Drive West, Santa Ana, CA 92701',
    parsed: {
      house_number: '700',
      road: 'civic center drive west',
      city: 'santa ana',
      state: 'ca',
      postcode: '92701',
      unit: null
    }
  },
  {
    address: 'In the front of the flagpoles at the main entry area to the Placentia Civic Center 401-411 E. Chapman Ave. Placentia, CA',
    parsed: {
      house_number: '401-411',
      road: 'e. chapman ave.',
      city: 'placentia',
      state: 'ca',
      postcode: null,
      unit: null
    }
  },
  // Table AttomForeclosure, id 20
  // auctionAddress: '100 The City Drive Orange Ca 92868'
  // auctionHouseNumber: '100'
  // auctionStreetName: 'The City Drive Orange Ca 92868'
  {
    address: '100 The City Drive Orange Ca 92868',
    parsed: {
      house_number: '100',
      road: 'the city drive',
      city: 'orange',
      state: 'ca',
      postcode: '92868',
      unit: null
    }
  },
  // Table AttomForeclosure, id 365
  // auctionAddress: '400 Civic Center Plaza'
  // auctionHouseNumber: '400'
  // auctionStreetName: 'CIVIC CENTER'
  // auctionSuffix: 'Plz'
  // auctionCity: 'Pomona Ca'
  // {
  //   address: '400 Civic Center Plaza',
  //   parts: {
  //     house_number: '400',
  //     road: 'CIVIC CENTER',
  //     city: 'Pomona Ca'
  //   },
  //   parsed: {
  //     house_number: '400',
  //     road: 'civic center plaza',
  //     city: 'pomona',
  //     state: 'ca',
  //     postcode: null,
  //     unit: null
  //   }
  // }
];
