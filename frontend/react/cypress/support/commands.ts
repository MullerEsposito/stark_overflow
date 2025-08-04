/// <reference types="cypress" />
import { MOCK_ACCOUNT, MOCK_CHAIN_ID } from "./constants";
import { Account, CallData, RpcProvider, stark } from "starknet";

const TESTER_ACCOUNT_ADDRESS = MOCK_ACCOUNT;
const TESTER_PRIVATE_KEY = "0x0000000000000000000000000000000071d7bb07b9a64f6f78ac4c816aff4da9";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      setupE2E(options: { walletInstalled: boolean }): Chainable<void>;
    }
  }
}

Cypress.Commands.add("setupE2E", ({ walletInstalled }) => {
  cy.on("window:before:load", (win) => {
    console.log("Injecting StarkNet wallet provider mock...");

    delete win.starknet_argentX;
    delete win.starknet_braavos;
    if (walletInstalled) {

      const rpcUrl = Cypress.env("RPC_URL");
      if (!rpcUrl) {
        throw new Error("RPC_URL não foi definida no ambiente do Cypress. Verifique cypress.config.ts");
      }
      const provider = new RpcProvider({ nodeUrl: rpcUrl });
      const signerAccount = new Account(provider, TESTER_ACCOUNT_ADDRESS, TESTER_PRIVATE_KEY, undefined, "0x2");

      console.log("Injetando mock HÍBRIDO de carteira StarkNet...");

      win.starknet_argentX = {
        id: "argentX",
        name: "Ready Wallet (Mocked by Cypress)",
        icon: "data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjQwIiBoZWlnaHQ9IjM2IiB2aWV3Qm94PSIwIDAgNDAgMzYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNC43NTgyIC0zLjk3MzY0ZS0wN0gxNC42MjM4QzE0LjI4NTEgLTMuOTczNjRlLTA3IDE0LjAxMzggMC4yODExNzggMTQuMDA2NCAwLjYzMDY4M0MxMy44MDE3IDEwLjQ1NDkgOC44MjIzNCAxOS43NzkyIDAuMjUxODkzIDI2LjM4MzdDLTAuMDIwMjA0NiAyNi41OTMzIC0wLjA4MjE5NDYgMjYuOTg3MiAwLjExNjczNCAyNy4yNzA5TDYuMDQ2MjMgMzUuNzM0QzYuMjQ3OTYgMzYuMDIyIDYuNjQwOTkgMzYuMDg3IDYuOTE3NjYgMzUuODc1NEMxMi4yNzY1IDMxLjc3MjggMTYuNTg2OSAyNi44MjM2IDE5LjY5MSAyMS4zMzhDMjIuNzk1MSAyNi44MjM2IDI3LjEwNTcgMzEuNzcyOCAzMi40NjQ2IDM1Ljg3NTRDMzIuNzQxIDM2LjA4NyAzMy4xMzQxIDM2LjAyMiAzMy4zMzYxIDM1LjczNEwzOS4yNjU2IDI3LjI3MDlDMzkuNDY0MiAyNi45ODcyIDM5LjQwMjIgMjYuNTkzMyAzOS4xMzA0IDI2LjM4MzdDMzAuNTU5NyAxOS43NzkyIDI1LjU4MDQgMTAuNDU0OSAyNS4zNzU5IDAuNjMwNjgzQzI1LjM2ODUgMC4yODExNzggMjUuMDk2OSAtMy45NzM2NGUtMDcgMjQuNzU4MiAtMy45NzM2NGUtMDdaIiBmaWxsPSIjRkY4NzVCIi8+Cjwvc3ZnPgo=",
        isConnected: false,
        account: signerAccount,
        selectedAddress: null,
        chainId: MOCK_CHAIN_ID,
        
        // Método request para compatibilidade com diferentes formatos de chamada
        request: async (payload: any) => {
          // Suporte para diferentes formatos de payload
          const type = payload.type || payload.method;
          const params = payload.params || payload;
          
          console.log(`[Cypress Mock] Handling request: ${type}`, params);
          
          switch (type) {
            case 'wallet_requestAccounts':
              win.starknet_argentX.isConnected = true;
              win.starknet_argentX.selectedAddress = MOCK_ACCOUNT;
              win.starknet_argentX.account = signerAccount;
              return Promise.resolve([MOCK_ACCOUNT]);
            
            case "wallet_addInvokeTransaction":
            case "starknet_addInvokeTransaction": {
              console.log(`[Cypress Mock] Processando ${type}...`);
              try {
                let calls = [];
                
                // Se é starknet_addInvokeTransaction, extrair do formato RPC
                if (type === "starknet_addInvokeTransaction") {
                  const invokeTransaction = params.invoke_transaction;
                  const calldata = invokeTransaction.calldata;
                  
                  // Parse da calldata
                  const numCalls = parseInt(calldata[0], 16);
                  let index = 1;
                  
                  for (let i = 0; i < numCalls; i++) {
                    const contractAddress = calldata[index++];
                    const entrypoint = calldata[index++];
                    const calldataLength = parseInt(calldata[index++], 16);
                    const callCalldata = calldata.slice(index, index + calldataLength);
                    index += calldataLength;
                    
                    calls.push({
                      contractAddress,
                      entrypoint,
                      calldata: callCalldata
                    });
                  }
                } else {
                  // wallet_addInvokeTransaction format - já vem no formato correto
                  calls = params.calls || params;
                  
                  console.log("[Cypress Mock] Formato wallet_addInvokeTransaction recebido:", calls);
                  console.log("[Cypress Mock] Params completo:", params);
                  
                  // Se calls é um array de uma única call, verificar estrutura
                  if (Array.isArray(calls) && calls.length === 1 && calls[0]) {
                    console.log("[Cypress Mock] Estrutura da call:", calls[0]);
                    
                    // Verificar se os campos essenciais existem
                    const call = calls[0];
                    if (!call.contractAddress && !call.contract_address) {
                      console.error("[Cypress Mock] ERRO: contractAddress não encontrado!", call);
                    }
                    if (!call.entrypoint && !call.entry_point) {
                      console.error("[Cypress Mock] ERRO: entrypoint não encontrado!", call);
                    }
                  }
                }
                
                console.log("[Cypress Mock] Calls extraídas:", calls);
                console.log("[Cypress Mock] Tipo de calls:", typeof calls, Array.isArray(calls));
                console.log("[Cypress Mock] Primeira call detalhada:", calls[0]);
                
                // Verificar se as calls estão no formato correto para o starknet.js
                const processedCalls = calls.map((call, index) => {
                  console.log(`[Cypress Mock] Processando call ${index}:`, call);
                  console.log(`[Cypress Mock] Keys da call:`, Object.keys(call));
                  
                  // Detectar formato da propriedade contractAddress
                  let contractAddress = call.contractAddress || call.contract_address || call.to;
                  let entrypoint = call.entrypoint || call.entry_point || call.selector;
                  let calldata = call.calldata || call.callData || [];
                  
                  console.log(`[Cypress Mock] Valores extraídos:`, {
                    contractAddress,
                    entrypoint, 
                    calldata: Array.isArray(calldata) ? `Array(${calldata.length})` : calldata
                  });
                  
                  // Garantir que contractAddress está com formato correto
                  if (typeof contractAddress === 'string' && contractAddress && !contractAddress.startsWith('0x')) {
                    contractAddress = '0x' + contractAddress;
                  }
                  
                  // Se ainda não temos contractAddress, tentar encontrar nos outros campos
                  if (!contractAddress) {
                    console.error(`[Cypress Mock] ERRO: Não foi possível encontrar contractAddress na call:`, call);
                    // Procurar em todos os campos da call
                    for (const [key, value] of Object.entries(call)) {
                      if (typeof value === 'string' && value.length > 20 && value.startsWith('0x')) {
                        console.log(`[Cypress Mock] Possível contractAddress encontrado em '${key}':`, value);
                      }
                    }
                  }
                  
                  // Se ainda não temos entrypoint, procurar
                  if (!entrypoint) {
                    console.error(`[Cypress Mock] ERRO: Não foi possível encontrar entrypoint na call:`, call);
                  }
                  
                  // CRÍTICO: Filtrar valores undefined/null da calldata
                  let cleanCalldata = [];
                  if (Array.isArray(calldata)) {
                    cleanCalldata = calldata
                      .filter(item => {
                        const isValid = item !== undefined && item !== null && item !== '';
                        if (!isValid) {
                          console.warn(`[Cypress Mock] Removendo item inválido da calldata:`, item);
                        }
                        return isValid;
                      })
                      .map(item => {
                        // Garantir que todos os itens são strings válidas
                        if (typeof item === 'number') {
                          return `0x${item.toString(16)}`;
                        }
                        if (typeof item === 'string') {
                          // Se não começar com 0x e for numérico, adicionar
                          if (!item.startsWith('0x') && /^[0-9]+$/.test(item)) {
                            return `0x${parseInt(item).toString(16)}`;
                          }
                          return item;
                        }
                        // Fallback para outros tipos
                        return String(item);
                      });
                    
                    console.log(`[Cypress Mock] Calldata original length: ${calldata.length}, após limpeza: ${cleanCalldata.length}`);
                    console.log(`[Cypress Mock] Calldata limpa:`, cleanCalldata);
                  }
                  
                  return {
                    contractAddress: contractAddress,
                    entrypoint: entrypoint,
                    calldata: cleanCalldata
                  };
                });
                
                console.log("[Cypress Mock] Calls processadas:", processedCalls);
                
                // Validação final antes de executar
                processedCalls.forEach((call, index) => {
                  console.log(`[Cypress Mock] Validando call ${index}:`);
                  console.log(`  - Contract: ${call.contractAddress}`);
                  console.log(`  - Entrypoint: ${call.entrypoint}`);
                  console.log(`  - Calldata length: ${call.calldata.length}`);
                  
                  call.calldata.forEach((item, itemIndex) => {
                    if (item === undefined || item === null) {
                      console.error(`  - ERRO: Item ${itemIndex} é ${item}`);
                    } else {
                      console.log(`  - Item ${itemIndex}: ${item} (tipo: ${typeof item})`);
                    }
                  });
                });
              
                  console.log(`[Mock Híbrido] Tentando estimar fee primeiro...`);
                  const feeEstimate = await signerAccount.estimateInvokeFee(processedCalls, { version: "0x3" });
                  console.log(`[Mock Híbrido] Fee estimado:`, feeEstimate);
                  
                  // Usar valores estimados para resource bounds mais precisos
                  const betterResourceBounds = {
                    l1_gas: {
                      max_amount: feeEstimate.gas_consumed || "0x5208",
                      max_price_per_unit: feeEstimate.gas_price || "0x174876e800"
                    },
                    l2_gas: {
                      max_amount: "0x0",
                      max_price_per_unit: "0x0"
                    },
                    data_gas: {
                      max_amount: feeEstimate.data_gas_consumed || "0x186a0",
                      max_price_per_unit: "0x1"
                    }
                  };
                const nonce = await signerAccount.getNonce();
                console.log(`[Mock Híbrido] Nonce: ${nonce}`);

                
                const transactionOptions = {
                  version: "0x3",
                  feeD_data_availability_mode: "L1",
                  nonce_data_availability_mode: "L1",
                  nonce: nonce,
                  resource_bounds: betterResourceBounds
              }
              
                const result = await signerAccount.execute(processedCalls, undefined, transactionOptions);
                console.log(`[Mock Híbrido] Transação enviada: ${result.transaction_hash}. Aguardando confirmação...`);
                
                await provider.waitForTransaction(result.transaction_hash);
                console.log(`[Mock Híbrido] Transação confirmada! Hash: ${result.transaction_hash}`);
                
                return { transaction_hash: result.transaction_hash };
                
              } catch (error) {
                console.error(`[Mock Híbrido ${type}] ERRO NA EXECUÇÃO:`, error);
                console.error(`[Mock Híbrido ${type}] Stack trace:`, error.stack);
                console.error(`[Mock Híbrido ${type}] Error message:`, error.message);
                console.error(`[Mock Híbrido ${type}] Error name:`, error.name);
                
                // Log das calls que causaram erro
                console.error(`[Mock Híbrido ${type}] Calls que causaram erro:`, calls);
                
                throw error;
              }
            }

            case 'starknet_getNonce':
              console.log(`[Mock Híbrido ${type}] TESTE`);
              return Promise.resolve("0x0");
            case 'wallet_getNonce':
              console.log(`[Mock Híbrido ${type}] TESTE`);
              return Promise.resolve("0x0");
            case 'starknet_estimateFee':
              console.log(`[Mock Híbrido ${type}] TESTE`);
              return Promise.resolve("0x0");
            case 'wallet_estimateFee':
              console.log(`[Mock Híbrido ${type}] TESTE`);
              return Promise.resolve("0x0");

              
            case 'wallet_getPermissions':
              return Promise.resolve(['accounts']);
              
            case 'wallet_watchAsset':
              return Promise.resolve(true);
              
            case 'wallet_switchStarknetChain':
              return Promise.resolve(true);
              
            case 'wallet_requestChainId':
              return Promise.resolve(MOCK_CHAIN_ID);

            default:
              console.warn(`[Cypress Mock] Unhandled method: ${type}. Letting it pass through.`, params);
              return Promise.resolve([]);
          }
        },

        // Método adicional para interceptar chamadas diretas do JSON-RPC
        send: async (payload: any) => {
          console.log("[Cypress Mock] Direct send call:", payload);
          return win.starknet_argentX.request(payload);
        },

        on: (event: string, callback?: Function) => {
          console.log(`[Cypress Mock] Wallet event listener registered for: ${event}`);
          // Simular eventos se necessário
          if (event === 'accountsChanged' && callback) {
            // Você pode disparar o callback quando necessário
          }
        },

        off: (event: string, callback?: Function) => {
          console.log(`[Cypress Mock] Wallet event listener removed for: ${event}`);
        },

        // Propriedades adicionais que podem ser necessárias
        version: "5.0.0",
        provider: {
          id: "argentX",
          name: "Argent X"
        }
      };

      // Garantir que o objeto está disponível globalmente
      win.starknet = win.starknet_argentX;

      // Interceptar chamadas JSON-RPC diretas
      const originalFetch = win.fetch;
      win.fetch = async (...args) => {
        const [url, options] = args;
        
        // Se for uma chamada para o RPC que contém starknet_addInvokeTransaction
        if (options && options.body && typeof options.body === 'string') {
          try {
            const body = JSON.parse(options.body);
            if (body.method === 'starknet_addInvokeTransaction') {
              console.log("[Cypress Mock] Intercepted RPC call:", body);
              
              // Processar via nosso mock
              const result = await win.starknet_argentX.request(body);
              
              // Retornar resposta mockada
              return Promise.resolve({
                ok: true,
                json: async () => ({
                  id: body.id,
                  jsonrpc: "2.0",
                  result: result
                })
              });
            }
          } catch (e) {
            // Se não conseguir fazer parse, continua com o fetch normal
          }
        }
        
        return originalFetch.apply(win, args);
      };

      // Interceptar postMessage se a aplicação usar essa abordagem
      const originalPostMessage = win.postMessage;
      win.postMessage = function(message, ...args) {
        console.log("[Cypress Mock] PostMessage intercepted:", message);
        
        if (typeof message === 'object' && message.method === 'starknet_addInvokeTransaction') {
          // Processar via nosso mock
          win.starknet_argentX.request(message).then(result => {
            // Simular resposta
            win.dispatchEvent(new MessageEvent('message', {
              data: {
                id: message.id,
                jsonrpc: "2.0",
                result: result
              }
            }));
          }).catch(error => {
            win.dispatchEvent(new MessageEvent('message', {
              data: {
                id: message.id,
                jsonrpc: "2.0",
                error: { message: error.message }
              }
            }));
          });
          return;
        }
        
        return originalPostMessage.apply(win, [message, ...args]);
      };

      win.starknet_braavos = {
        id: "braavos",
        name: "Braavos (Mocked by Cypress)",
        icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aAogICAgICAgIGQ9Ik02Mi43MDUgMTMuOTExNkM2Mi44MzU5IDE0LjEzMzMgNjIuNjYyMSAxNC40MDcgNjIuNDAzOSAxNC40MDdDNTcuMTgwNyAxNC40MDcgNTIuOTM0OCAxOC41NDI3IDUyLjgzNTEgMjMuNjgxN0M1MS4wNDY1IDIzLjM0NzcgNDkuMTkzMyAyMy4zMjI2IDQ3LjM2MjYgMjMuNjMxMUM0Ny4yMzYxIDE4LjUxNTYgNDMuMDAwOSAxNC40MDcgMzcuNzk0OCAxNC40MDdDMzcuNTM2NSAxNC40MDcgMzcuMzYyNSAxNC4xMzMxIDM3LjQ5MzUgMTMuOTExMkM0MC4wMjE3IDkuNjI4MDkgNDQuNzIwNCA2Ljc1IDUwLjA5OTEgNi43NUM1NS40NzgxIDYuNzUgNjAuMTc2OSA5LjYyODI2IDYyLjcwNSAxMy45MTE2WiIKICAgICAgICBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMzcyXzQwMjU5KSIgLz4KICAgIDxwYXRoCiAgICAgICAgZD0iTTc4Ljc2MDYgNDUuODcxOEM4MC4yNzI1IDQ2LjMyOTcgODEuNzAyNSA0NS4wMDU1IDgxLjE3MTQgNDMuNTIyMkM3Ni40MTM3IDMwLjIzMzQgNjEuMzkxMSAyNC44MDM5IDUwLjAyNzcgMjQuODAzOUMzOC42NDQyIDI0LjgwMzkgMjMuMjg2OCAzMC40MDcgMTguODc1NCA0My41OTEyQzE4LjM4MjQgNDUuMDY0NSAxOS44MDgzIDQ2LjM0NDYgMjEuMjk3OCA0NS44ODgxTDQ4Ljg3MiAzNy40MzgxQzQ5LjUzMzEgMzcuMjM1NSA1MC4yMzk5IDM3LjIzNDQgNTAuOTAxNyAzNy40MzQ4TDc4Ljc2MDYgNDUuODcxOFoiCiAgICAgICAgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzM3Ml80MDI1OSkiIC8+CiAgICA8cGF0aAogICAgICAgIGQ9Ik0xOC44MTMyIDQ4LjE3MDdMNDguODkzNSAzOS4wNDcyQzQ5LjU1MDYgMzguODQ3OCA1MC4yNTI0IDM4Ljg0NzMgNTAuOTA5OCAzOS4wNDU2TDgxLjE3ODEgNDguMTc1MkM4My42OTEyIDQ4LjkzMzIgODUuNDExIDUxLjI0ODMgODUuNDExIDUzLjg3MzVWODEuMjIzM0M4NS4yOTQ0IDg3Ljg5OTEgNzkuMjk3NyA5My4yNSA3Mi42MjQ1IDkzLjI1SDYxLjU0MDZDNjAuNDQ0OSA5My4yNSA1OS41NTc3IDkyLjM2MzcgNTkuNTU3NyA5MS4yNjhWODEuNjc4OUM1OS41NTc3IDc3LjkwMzEgNjEuNzkyMSA3NC40ODU1IDY1LjI0OTggNzIuOTcyOUM2OS44ODQ5IDcwLjk0NTQgNzUuMzY4MSA2OC4yMDI4IDc2LjM5OTQgNjIuNjk5MkM3Ni43MzIzIDYwLjkyMjkgNzUuNTc0MSA1OS4yMDk0IDczLjgwMjQgNTguODU3M0M2OS4zMjI2IDU3Ljk2NjcgNjQuMzU2MiA1OC4zMTA3IDYwLjE1NjQgNjAuMTg5M0M1NS4zODg3IDYyLjMyMTkgNTQuMTQxNSA2NS44Njk0IDUzLjY3OTcgNzAuNjMzN0w1My4xMjAxIDc1Ljc2NjJDNTIuOTQ5MSA3Ny4zMzQ5IDUxLjQ3ODUgNzguNTM2NiA0OS45MDE0IDc4LjUzNjZDNDguMjY5OSA3OC41MzY2IDQ3LjA0NjUgNzcuMjk0IDQ2Ljg2OTYgNzUuNjcxMkw0Ni4zMjA0IDcwLjYzMzdDNDUuOTI0OSA2Ni41NTI5IDQ1LjIwNzkgNjIuNTg4NyA0MC45ODk1IDYwLjcwMThDMzYuMTc3NiA1OC41NDk0IDMxLjM0MTkgNTcuODM0NyAyNi4xOTc2IDU4Ljg1NzNDMjQuNDI2IDU5LjIwOTQgMjMuMjY3OCA2MC45MjI5IDIzLjYwMDcgNjIuNjk5MkMyNC42NDEgNjguMjUwNyAzMC4wODEyIDcwLjkzMDUgMzQuNzUwMyA3Mi45NzI5QzM4LjIwOCA3NC40ODU1IDQwLjQ0MjQgNzcuOTAzMSA0MC40NDI0IDgxLjY3ODlWOTEuMjY2M0M0MC40NDI0IDkyLjM2MiAzOS41NTU1IDkzLjI1IDM4LjQ1OTkgOTMuMjVIMjcuMzc1NkMyMC43MDI0IDkzLjI1IDE0LjcwNTcgODcuODk5MSAxNC41ODkxIDgxLjIyMzNWNTMuODY2M0MxNC41ODkxIDUxLjI0NDYgMTYuMzA0NSA0OC45MzE2IDE4LjgxMzIgNDguMTcwN1oiCiAgICAgICAgZmlsbD0idXJsKCNwYWludDJfbGluZWFyXzM3Ml80MDI1OSkiIC8+CiAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMzcyXzQwMjU5IiB4MT0iNDkuMzA1NyIgeTE9IjIuMDc5IiB4Mj0iODAuMzYyNyIgeTI9IjkzLjY1OTciCiAgICAgICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0Y1RDQ1RSIgLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY5NjAwIiAvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzM3Ml80MDI1OSIgeDE9IjQ5LjMwNTciIHkxPSIyLjA3OSIgeDI9IjgwLjM2MjciIHkyPSI5My42NTk3IgogICAgICAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGNUQ0NUUiIC8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTYwMCIgLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQyX2xpbmVhcl8zNzJfNDAyNTkiIHgxPSI0OS4zMDU3IiB5MT0iMi4wNzkiIHgyPSI4MC4zNjI3IiB5Mj0iOTMuNjU5NyIKICAgICAgICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjRjVENDVFIiAvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjk2MDAiIC8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KPC9zdmc+",
        isConnected: false,
      };
    } else {
      console.log("[Cypress] Ensuring no wallet providers are injected...");
    }
  });
});

Cypress.Commands.add("login", () => {
  cy.log("Performing UI login...");
  cy.get('[data-cy="connect-wallet-btn"]').click();
  cy.get('[data-cy="wallet-modal"]').should("be.visible");
  cy.contains("button", "Argent X").click();

  cy.get('[data-cy="wallet-address-btn"]', { timeout: 10000 }).should("be.visible");
});