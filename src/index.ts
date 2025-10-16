import {RestApplication, post, requestBody} from '@loopback/rest';
import * as path from 'path';
import postal from 'node-postal';
import {addressParse} from '@zerodep/address';
import * as addresser from "addresser";

class ApiController {
  @post('/api')
  async submit(
    @requestBody() body: {address: string, lib: string}
  ): Promise<any> {
    const lib = body.lib || 'node-postal';

    if (lib === 'node-postal') {
      return parseWithNodePostal(body.address);
    } else if (lib === '@zerodep/address') {
      return parseWithZerodep(body.address);
    } else if (lib === 'moneals/addresser') {
      return parseWithMoneals(body.address);
    } else {
      return {error: 'Unknown library'};
    }
  }
}

const parseWithNodePostal = (address: string) => {
  const result = postal.parser.parse_address(address);
  const formatted: Record<string, string> = {};

  result.forEach(({component, value}) => {
    formatted[component] = value;
  });

  return formatted;
}

const parseWithZerodep = (address: string) => {
  return addressParse(address);
}

const parseWithMoneals = (address: string) => {
  try {
    return addresser.parseAddress(address);
  } catch (e) {
    return {
      error: 'Failed to parse address',
      details: e,
    };
  }
}

export async function main(options: object = {}) {
  const app = new RestApplication(options);
  app.controller(ApiController);
  app.static('/', path.join(__dirname, '../public'));
  await app.start();
  console.log(`Server is running at http://localhost:3000`);
}

if (require.main === module) {
  main();
}
