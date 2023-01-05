import {
  TokCtrtWithoutSplit,
  Chain,
  ChainID,
  NodeAPI,
} from '@virtualeconomy/js-vsys';
import { STARDUST_CTRT_ID, TEST_NET } from './constants';

export default async (address: string) => {
  const nodeApi = NodeAPI.new(TEST_NET);
  const chainId = new ChainID('TEST_NET', ChainID.elems.TEST_NET);
  const chain = new Chain(nodeApi, chainId);
  const stardustContract = new TokCtrtWithoutSplit(STARDUST_CTRT_ID, chain);
  const balance = await stardustContract.getTokBal(address);
  return +balance.data;
};
