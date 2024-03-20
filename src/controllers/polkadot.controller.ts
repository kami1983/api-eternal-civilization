// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Request, ResponseObject, RestBindings, get, param, post, requestBody, response} from '@loopback/rest';
import dotenv from 'dotenv';
import {createArtCollectionOnChain, getNftBindInfos, getNftCount, getPolkadotBalance, issueArtOwnershipOnChain, transferArtOwnershipOnChain} from './polkadot-libs/libs';

dotenv.config();


/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE_BALANCE: ResponseObject = {
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

const PING_RESPONSE_CREATE_ART_COLLECTION: ResponseObject = {
  description: 'Polkadot Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PolkadotResponse',
        properties: {
          sid: {type: 'string'},
          name: {type: 'string'},
          url: {type: 'string'},
          txData: {type: 'object', properties: {block_hash: {type: 'string'}, status: {type: 'string'}, error_method: {type: 'string'}, error_data: {type: 'string'}}},
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

//
const PING_RESPONSE_ISSUE_ART_COLLECTION: ResponseObject = {
  description: 'Polkadot Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PolkadotResponse',
        properties: {
          txData: {type: 'object', properties: {block_hash: {type: 'string'}, status: {type: 'string'}, error_method: {type: 'string'}, error_data: {type: 'string'}}},
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

//
const PING_RESPONSE_GET_NFT_COUNT: ResponseObject = {
  description: 'Polkadot Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PolkadotResponse',
        properties: {
          sid: {type: 'string'},
          count: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
        },
      },
    },
  },
};

const PING_RESPONSE_GET_NFT_BIND_INFOS: ResponseObject = {
  description: 'Polkadot Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PolkadotResponse',
        properties: {
          bid: {type: 'string'},
          sid: {type: 'string'},
          count: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
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
  @response(200, PING_RESPONSE_BALANCE)
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

  @post('/createArtCollection')
  @response(200, PING_RESPONSE_CREATE_ART_COLLECTION)
  @authenticate('jwt')
  async createArtCollection(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              sid: {type: 'string'},
              name: {type: 'string'},
              uri: {type: 'string'},

              asset_cate: {type: 'number'},
              title: {type: 'string'},
              thumb: {type: 'string'},
              short_desc: {type: 'string'},
              img_desc: {type: 'string'},
              long_desc: {type: 'string'},
              asset_url: {type: 'string'},
              asset_ext: {type: 'string'},
              group_id: {type: 'number'},
              amount: {type: 'number'},
              user_id: {type: 'string'},
              price: {type: 'number'}

            },
          },
        },
      },
    })
    requestData: {
      sid: string,
      name: string,
      uri: string,
      asset_cate: number | null,
      title: string | null,
      thumb: string | null,
      short_desc: string | null,
      img_desc: string | null,
      long_desc: string | null,
      asset_url: string | null,
      asset_ext: string | null,
      group_id: number | null,
      amount: number | null,
      user_id: string | null,
      price: number | null
    },
  ): Promise<object> {
    const {
      sid,
      name,
      uri,

      asset_cate,
      title,
      thumb,
      short_desc,
      img_desc,
      long_desc,
      asset_url,
      asset_ext,
      group_id,
      amount,
      user_id,
      price
    } = requestData
    return {
      sid,
      name,
      uri,
      txData: await createArtCollectionOnChain(
        sid,
        name,
        uri,

        asset_cate,
        title,
        thumb,
        short_desc,
        img_desc,
        long_desc,
        asset_url,
        asset_ext,
        group_id,
        amount,
        user_id,
        price
      ),
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @post('/issueArtOwnership')
  @response(200, PING_RESPONSE_ISSUE_ART_COLLECTION)
  @authenticate('jwt')
  async issueArtOwnership(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              bids: {type: 'array', items: {type: 'string'}},
              sids: {type: 'array', items: {type: 'string'}},
              count: {type: 'array', items: {type: 'number'}},
            },
          },
        },
      },
    })
    requestData: {bids: string[], sids: string[], count: number[]},
  ): Promise<object> {
    const {bids, sids, count} = requestData
    console.log({bids, sids, count})
    return {
      txData: await issueArtOwnershipOnChain(bids, sids, count),
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @get('/nftCount/{sid}')
  @response(200, PING_RESPONSE_GET_NFT_COUNT)
  @authenticate('jwt')
  async nftCount(
    @param.path.string('sid') sid: string,
  ): Promise<object> {

    return {
      sid,
      count: await getNftCount(sid),
      date: new Date(),
      url: this.req.url,
      // headers: Object.assign({}, this.req.headers),
    };
  }

  @get('/nftBindInfos/{bid}/{sid}')
  @response(200, PING_RESPONSE_GET_NFT_BIND_INFOS)
  @authenticate('jwt')
  async nftBindInfos(
    @param.path.string('bid') bid: string,
    @param.path.string('sid') sid: string,
  ): Promise<object> {

    return {
      bid,
      sid,
      count: await getNftBindInfos(bid, sid),
      date: new Date(),
      url: this.req.url,
      // headers: Object.assign({}, this.req.headers),
    };
  }

  @post('/transferArtOwnership')
  @response(200, PING_RESPONSE_ISSUE_ART_COLLECTION)
  @authenticate('jwt')
  async transferArtOwnership(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              sid: {type: 'string'},
              from: {type: 'string'},
              to: {type: 'string'},
              count: {type: 'number'},
            },
          },
        },
      },
    })
    requestData: {sid: string, from: string, to: string, count: number},
  ): Promise<object> {
    const {sid, from, to, count} = requestData
    console.log({sid, from, to, count})
    return {
      txData: await transferArtOwnershipOnChain(sid, from, to, count),
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

}





