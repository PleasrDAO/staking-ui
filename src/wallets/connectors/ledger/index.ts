import { AbstractConnector } from '@web3-react/abstract-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';

import { WalletConnector } from 'wallets/connectors/WalletConnector';

import { getHttpRpcUrl } from 'web3/utils';

import LedgerLogo from 'assets/wallets/ledger.svg';

const WEB3_POLLING_INTERVAL = Number(process.env.REACT_APP_WEB3_POLLING_INTERVAL);
const LEDGER_BASE_DERIVATION_PATH = 'base_derivation_path';
const LEDGER_LIVE_DERIVATION_PATH = "m/44'/60'/0'/0";

export type LedgerWalletArgs = {
  baseDerivationPath?: string;
};

export const LedgerWalletConfig: WalletConnector = {
  id: 'ledger',
  logo: LedgerLogo,
  name: 'Ledger',
  factory(chainId: number, args?: LedgerWalletArgs): AbstractConnector {
    let baseDerivationPath: string | undefined = args?.baseDerivationPath;

    if (!baseDerivationPath) {
      baseDerivationPath = sessionStorage.getItem(LEDGER_BASE_DERIVATION_PATH) ?? LEDGER_LIVE_DERIVATION_PATH;
    }

    return new LedgerConnector({
      chainId: chainId,
      url: getHttpRpcUrl(chainId),
      pollingInterval: WEB3_POLLING_INTERVAL,
      baseDerivationPath,
    });
  },
  onConnect(connector: AbstractConnector, args?: LedgerWalletArgs): void {
    const { sessionStorage } = window;

    if (args?.baseDerivationPath) {
      sessionStorage.setItem(LEDGER_BASE_DERIVATION_PATH, args?.baseDerivationPath);
    }
  },
  onDisconnect(): void {
    const { sessionStorage } = window;
    sessionStorage.removeItem(LEDGER_BASE_DERIVATION_PATH);
  },
  onError(error: Error): Error | undefined {
    return error;
  },
};