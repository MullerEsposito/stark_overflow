// export const RPC_URL = 'http://localhost:5050';
export const RPC_URL = Cypress.env('RPC_URL');
export const SELECTORS = {
  GET_ALL_FORUMS: '0x17cc439fbc04c207fe4f86321ef047d708a1e2b8b303fe943cb9461673a5496'  // Adicione outros seletores de função aqui conforme necessário
};

export const MOCK_ACCOUNT = Cypress.env('CONTRACT_ADDRESS');
export const MOCK_CHAIN_ID = '0x534e5f474f45524c49';