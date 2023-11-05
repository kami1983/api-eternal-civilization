// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Request, ResponseObject, RestBindings, get, param, response} from '@loopback/rest';
import {ApiPromise, WsProvider} from '@polkadot/api';

// import {inject} from '@loopback/core';


/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Polkadot Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PolkadotResponse',
        properties: {
          balance: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * Try /balance/5CGNb2dqMoMhU1F7VvQJ9aHFf9R9YZZntBun6keCAbdcCnDg
 */
export class PolkadotController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) { }

  @get('/balance/{address}')
  @response(200, PING_RESPONSE)
  @authenticate('jwt')
  async balance(
    @param.path.string('address') address: string,
  ): Promise<object> {
    return {
      balance: await getPolkadotBalance(address),
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}

async function getPolkadotBalance(userAddress: string): Promise<string> {
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({provider: wsProvider});
  // return api.genesisHash.toHex()
  const data = await api.query.system.account(userAddress);
  // @ts-ignore
  const balance = data.data.free.toNumber().toString();
  return balance

}
