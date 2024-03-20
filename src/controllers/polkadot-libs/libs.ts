
import {ApiPromise, Keyring, WsProvider} from '@polkadot/api';
import BN from 'bn.js';

export async function getPolkadotBalance(userAddress: string): Promise<string> {
  const rpc = process.env.POLKADOT_WSS
  const wsProvider = new WsProvider(rpc);
  const api = await ApiPromise.create({provider: wsProvider});
  // return api.genesisHash.toHex()
  const data = await api.query.system.account(userAddress);
  // @ts-ignore
  const balance = data.data.free.toString();
  return balance
}

export async function getNftCount(sid: string): Promise<string> {
  const rpc = process.env.POLKADOT_WSS
  const wsProvider = new WsProvider(rpc);
  const api = await ApiPromise.create({provider: wsProvider});
  const data = await api.query.eternalArtsModule.nftCount(sid);
  const count = data.toString();
  return count
}

export async function getNftBindInfos(bid: string, sid: string): Promise<string> {
  const rpc = process.env.POLKADOT_WSS
  const wsProvider = new WsProvider(rpc);
  const api = await ApiPromise.create({provider: wsProvider});
  const data = await api.query.eternalArtsModule.nftBindInfos([bid, sid]);
  const count = data.toString();
  return count
}

export type ChainTxResult = {
  block_hash: string,
  extrinsic_hash: String,
  block_number: number,
  status: string,
  error_method: string,
  error_data: string,
}
export async function createArtCollectionOnChain(
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

): Promise<ChainTxResult> {
  const rpc = process.env.POLKADOT_WSS
  const wsProvider = new WsProvider(rpc);
  const api = await ApiPromise.create({provider: wsProvider});
  const keyring = new Keyring({type: 'sr25519'});

  // Some mnemonic phrase
  const PHRASE = process.env.EC_OPERATOR_MNEMONIC ?? '';
  // Add an account, straight mnemonic
  const newPair = keyring.addFromUri(PHRASE);

  console.log('DEBUG', {
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

  })

  const doTx = (): Promise<ChainTxResult> => {
    let res: ChainTxResult = {
      block_hash: '0x0',
      extrinsic_hash: '0x0',
      block_number: 0,
      status: 'faild',
      error_method: '',
      error_data: '',
    }
    return new Promise((resolve, reject) => {
      api.tx.eternalArtsModule
        .createArtCollection(
          new BN(sid.toString()),
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
          new BN(user_id?.toString() ?? '0'),
          price
        ).signAndSend(newPair, {}, async ({events = [], status}) => {

          if (status.isInBlock) {
            events.forEach(({event: {data, method, section}, phase}) => {
              if (method.toLocaleLowerCase() === 'extrinsicfailed') {
                res.error_method = method
                res.error_data = data.toString()
              } else if (method.toLocaleLowerCase() === 'extrinsicsuccess') {
                res.status = 'success'
              }
            });
          } else if (status.isFinalized) {

            res.block_hash = status.asFinalized.toHex()
            await api.rpc.chain.getBlock(status.asFinalized).then((block) => {
              block.block.extrinsics.find((extrinsic) => {
                // https://polkadot.js.org/apps/?rpc=xxx#/extrinsics/decode/0x...
                res.extrinsic_hash = extrinsic.method.toHex()
                res.block_number = block.block.header.number.toNumber()
              })
            }
            );

            resolve(res);
          }
        });
    })
  }
  return await doTx()
}

//
export async function issueArtOwnershipOnChain(bids: string[], sids: string[], count: number[]): Promise<ChainTxResult> {
  const rpc = process.env.POLKADOT_WSS
  const wsProvider = new WsProvider(rpc);
  const api = await ApiPromise.create({provider: wsProvider});
  const keyring = new Keyring({type: 'sr25519'});

  // Some mnemonic phrase
  const PHRASE = process.env.EC_OPERATOR_MNEMONIC ?? '';
  // Add an account, straight mnemonic
  const newPair = keyring.addFromUri(PHRASE);

  const bigint_sids = sids.map((sid) => new BN(sid.toString()))

  const doTx = (): Promise<ChainTxResult> => {
    let res: ChainTxResult = {
      block_hash: '0x0',
      extrinsic_hash: '0x0',
      block_number: 0,
      status: 'faild',
      error_method: '',
      error_data: '',
    }
    return new Promise((resolve, reject) => {
      api.tx.eternalArtsModule
        .issueArtOwnership(bids, bigint_sids, count)
        .signAndSend(newPair, {}, async ({events = [], status}) => {
          if (status.isInBlock) {
            events.forEach(({event: {data, method, section}, phase}) => {
              if (method.toLocaleLowerCase() === 'extrinsicfailed') {
                res.error_method = method
                res.error_data = data.toString()
              } else if (method.toLocaleLowerCase() === 'extrinsicsuccess') {
                res.status = 'success'
              }
            });
          } else if (status.isFinalized) {
            res.block_hash = status.asFinalized.toHex()
            await api.rpc.chain.getBlock(status.asFinalized).then((block) => {
              block.block.extrinsics.find((extrinsic) => {
                // https://polkadot.js.org/apps/?rpc=xxx#/extrinsics/decode/0x...
                res.extrinsic_hash = extrinsic.method.toHex()
                res.block_number = block.block.header.number.toNumber()
              })
            }
            );

            resolve(res);
          }
        });
    })
  }
  return await doTx()
}


//
export async function transferArtOwnershipOnChain(sid: string, from: string, to: string, count: number): Promise<ChainTxResult> {
  const rpc = process.env.POLKADOT_WSS
  const wsProvider = new WsProvider(rpc);
  const api = await ApiPromise.create({provider: wsProvider});
  const keyring = new Keyring({type: 'sr25519'});

  // Some mnemonic phrase
  const PHRASE = process.env.EC_OPERATOR_MNEMONIC ?? '';
  // Add an account, straight mnemonic
  const newPair = keyring.addFromUri(PHRASE);

  const doTx = (): Promise<ChainTxResult> => {
    let res: ChainTxResult = {
      block_hash: '0x0',
      extrinsic_hash: '0x0',
      block_number: 0,
      status: 'faild',
      error_method: '',
      error_data: '',
    }
    return new Promise((resolve, reject) => {
      api.tx.eternalArtsModule
        .transferArtOwnership(new BN(sid.toString()), from, to, count)
        .signAndSend(newPair, {}, async ({events = [], status}) => {
          if (status.isInBlock) {
            events.forEach(({event: {data, method, section}, phase}) => {
              if (method.toLocaleLowerCase() === 'extrinsicfailed') {
                res.error_method = method
                res.error_data = data.toString()
              } else if (method.toLocaleLowerCase() === 'extrinsicsuccess') {
                res.status = 'success'
              }
            });
          } else if (status.isFinalized) {
            res.block_hash = status.asFinalized.toHex()
            await api.rpc.chain.getBlock(status.asFinalized).then((block) => {
              block.block.extrinsics.find((extrinsic) => {
                // https://polkadot.js.org/apps/?rpc=xxx#/extrinsics/decode/0x...
                res.extrinsic_hash = extrinsic.method.toHex()
                res.block_number = block.block.header.number.toNumber()
              })
            }
            );

            resolve(res);
          }
        });
    })
  }
  return await doTx()
}
