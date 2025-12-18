import { create } from 'zustand';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

interface WalletState {
  userSession: UserSession;
  userData: any | null;
  isConnected: boolean;
  address: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  checkConnection: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  userSession,
  userData: null,
  isConnected: false,
  address: null,

  connectWallet: () => {
    showConnect({
      appDetails: {
        name: 'SNFT Marketplace',
        icon: '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        set({
          userData,
          isConnected: true,
          address: userData.profile.stxAddress.mainnet,
        });
      },
      userSession,
    });
  },

  disconnectWallet: () => {
    userSession.signUserOut();
    set({
      userData: null,
      isConnected: false,
      address: null,
    });
  },

  checkConnection: () => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      set({
        userData,
        isConnected: true,
        address: userData.profile.stxAddress.mainnet,
      });
    }
  },
}));
