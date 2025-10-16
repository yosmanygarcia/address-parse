export const data = [
  {
    address: '123 MAIN ST #4',
    parsed: {
      house_number: '123',
      road: 'main st',
      city: undefined,
      state: undefined,
      postcode: undefined,
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
      postcode: undefined,
      unit: undefined
    }
  },
  {
    address: '5253 N. 44th Dr., Phoenix, AZ',
    parsed: {
      house_number: '5253',
      road: 'n. 44th dr.',
      city: 'phoenix',
      state: 'az',
      postcode: undefined,
      unit: undefined
    }
  },
  {
    address: '12-14 Main St, Anytown, USA',
    parsed: {
      house_number: '12-14',
      road: 'main st',
      city: 'anytown',
      state: undefined,
      postcode: undefined,
      unit: undefined
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
      unit: undefined
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
      unit: undefined
    }
  }
];
