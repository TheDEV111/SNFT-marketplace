'use client';

import { create } from 'zustand';
import { connect, disconnect, isConnected, getLocalStorage } from '@stacks/connect';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  checkConnection: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  address: null,

  connectWallet: async () => {
    if (typeof window === 'undefined') return;
    
    try {
      // Use the modern connect() API - opens wallet selection modal
      const response = await connect();
      
      // Get the stored address from local storage
      const data = getLocalStorage();
      const stxAddress = data?.addresses?.stx?.[0]?.address || null;
      
      set({
        isConnected: true,
        address: stxAddress,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      set({
        isConnected: false,
        address: null,
      });
    }
  },

  disconnectWallet: () => {
    disconnect();
    set({
      isConnected: false,
      address: null,
    });
  },

  checkConnection: () => {
    if (isConnected()) {
      const data = getLocalStorage();
      const stxAddress = data?.addresses?.stx?.[0]?.address || null;
      set({
        isConnected: true,
        address: stxAddress,
      });
    } else {
      set({
        isConnected: false,
        address: null,
      });
    }
  },
}));
