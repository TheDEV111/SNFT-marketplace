'use client';

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
    if (typeof window === 'undefined') return;
    
    showConnect({
      appDetails: {
        name: 'SNFT Marketplace',
        icon: window.location.origin + '/logo.png',
      },
      onFinish: () => {
        setTimeout(() => {
          if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            set({
              userData,
              isConnected: true,
              address: userData.profile.stxAddress.mainnet,
            });
          }
        }, 100);
      },
      onCancel: () => {
        console.log('User cancelled authentication');
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
    window.location.reload();
  },

  checkConnection: () => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      set({
        userData,
        isConnected: true,
        address: userData.profile.stxAddress.mainnet,
      });
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        set({
          userData,
          isConnected: true,
          address: userData.profile.stxAddress.mainnet,
        });
      });
    }
  },
}));
