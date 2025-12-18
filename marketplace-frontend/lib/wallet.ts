'use client';

import { create } from 'zustand';
import { AppConfig, UserSession } from '@stacks/connect';

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

  connectWallet: async () => {
    if (typeof window === 'undefined') return;
    
    try {
      // Dynamically import the connect function to avoid SSR issues
      const { showConnect } = await import('@stacks/connect');
      
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
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to open wallet connection. Please make sure Hiro Wallet extension is installed.');
    }
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
