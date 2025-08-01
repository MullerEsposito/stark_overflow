import { hash } from "starknet";

// export const RPC_URL = 'http://localhost:5050';
export const RPC_URL = Cypress.env('RPC_URL');
export const SELECTORS = {
  GET_ALL_FORUMS:hash.getSelectorFromName("get_forums"),
  GET_OWNER: hash.getSelectorFromName("owner")
};

export const MOCK_ACCOUNT ='0x2016836a56b71f0d02689e69e326f4f4c1b9057164ef592671cf0d37c8040c0';
export const MOCK_CHAIN_ID = '0x534e5f474f45524c49';