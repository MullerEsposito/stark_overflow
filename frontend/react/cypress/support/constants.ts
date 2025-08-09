//export const RPC_URL = 'http://localhost:5050';
export const RPC_URL = Cypress.env('RPC_URL');
export const SELECTORS = {
  GET_ALL_FORUMS: '0x17cc439fbc04c207fe4f86321ef047d708a1e2b8b303fe943cb9461673a5496'
};

export const MOCK_ACCOUNT ='0x064b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691';
export const MOCK_CHAIN_ID = '0x534e5f5345504f4c4941';