export const dataForPrimaryNumber = [
  {
    input: {
      address: 'At the west of 12720 Norwalk Blvd W Apt 12 Norwalk CA 90650',
    },
    output: {
      value: ['12720'],
      start: 4,
      end: 4
    }
  }
];

export const dataForPredirectional = [
  {
    input: {
      address: 'At the west of 12720 W Norwalk Blvd W Apt 12 Norwalk CA 90650',
    },
    output: {
      value: ['w'],
      start: 5,
      end: 5
    }
  }
]

export const dataForStreetNameAndSuffix = [
  {
    input: {
      address: 'At the west of 12720 Norwalk Blvd W Apt 12 Norwalk CA 90650',
    },
    output: {
      value: ['norwalk', 'blvd'],
      start: 5,
      end: 6
    }
  },
  // With street name containing a suffix-like word (ridge)
  {
    input: {
      address: '5 Wild Ridge Ct, Las Vegas NV 89135',
    },
    output: {
      value: ['wild', 'ridge', 'ct'],
      start: 1,
      end: 3
    }
  }
]

export const dataForDeliveryLine = [
  {
    input: {
      address: 'At the west of 12720 Norwalk Blvd W Apt 12 Norwalk CA 90650',
    },
    output: {
      primaryNumber: ['12720'],
      predirectional: [],
      dataForStreetNameAndSuffix: ['norwalk', 'blvd'],
      postdirectional: [],
      secondary: ['apt', '12']
    }
  },
]

export const dataForCity = [
  {
    input: {
      address: '5 Wild Ridge Ct, Las Vegas NV 89135',
    },
    output: {
      city: ['las', 'vegas']
    }
  },
]

export const dataForPostdirectional = [
  {
    input: {
      address: 'At the west of 12720 W Norwalk Blvd W Apt 12 Norwalk CA 90650',
    },
    output: {
      value: ['w'],
      start: 8,
      end: 8
    }
  }
]

export const dataForSecondary = [
  // In the middle
  {
    input: {
      address: '12720 Norwalk Blvd Apt 12 Norwalk CA 90650',
    },
    output: {
      value: ['apt',  '12'],
      start: 3,
      end: 4
    }
  },
  // At the end
  {
    input: {
      address: '12720 Norwalk Blvd Norwalk CA 90650 Apt 12',
    },
    output: {
      value: ['apt',  '12'],
      start: 6,
      end: 7
    }
  },
  // With #
  {
    input: {
      address: '12720 Norwalk Blvd Norwalk CA 90650 # 12',
    },
    output: {
      value: ['#',  '12'],
      start: 6,
      end: 7
    }
  },
  // With # no space
  {
    input: {
      address: '12720 Norwalk Blvd Norwalk CA 90650 #12',
    },
    output: {
      value: ['#', '12'],
      start: 6,
      end: 7
    }
  },
]

export const dataForStates = [
  // {
  //   input: {
  //     // Table AttomForeclosure, id 268
  //     address: '400 Civic Center Plaza',
  //     city: 'Pomona Ca',
  //     state: null
  //   },
  //   output: {
  //     state: 'ca'
  //   }
  // },
  // {
  //   input: {
  //     address: '400 Civic Center Plaza',
  //     city: 'Pomona, Ca',
  //     state: null
  //   },
  //   output: {
  //     state: 'ca'
  //   }
  // },
  // {
  //   input: {
  //     address: '400 Civic Center Plaza Pomona Ca',
  //     city: null,
  //     state: null
  //   },
  //   output: {
  //     state: 'ca'
  //   }
  // },
  // {
  //   input: {
  //     address: 'By the fountain located at 400 Civic Center Plaza, Pomona, CA 91766',
  //     city: null,
  //     state: null
  //   },
  //   output: {
  //     state: 'ca'
  //   }
  // }
  {
    input: {
      address: 'By the fountain located at 400 Civic Center Plaza, Pomona, CA 91766'
    },
    output: {
      state: ['ca']
    }
  },
  // State with two words
  {
    input: {
      address: '123 Main St, Albany, New York 12207'
    },
    output: {
      state: ['new', 'york']
    }
  }
];

export const dataForZips = [
  {
    input: {
      address: '123 Main St, Albany, New York 12207'
    },
    output: {
      zip: ['12207']
    }
  },
  // No state
  {
    input: {
      address: '123 Main St, Albany 12207'
    },
    output: {
      zip: null
    }
  },
  // No zip
  {
    input: {
      address: 'At the west of 12720 Norwalk Blvd',
    },
    output: {
      zip: null
    }
  }
]
