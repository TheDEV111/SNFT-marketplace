// Smart Contract Configuration
export const CONTRACTS = {
  nftToken: {
    address: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
    name: 'nft-token'
  },
  marketplace: {
    address: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
    name: 'marketplace'
  },
  royaltyDistributor: {
    address: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
    name: 'royalty-distributor'
  }
} as const;

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'mainnet';

export const CONTRACT_ADDRESSES = {
  NFT_TOKEN: `${CONTRACTS.nftToken.address}.${CONTRACTS.nftToken.name}`,
  MARKETPLACE: `${CONTRACTS.marketplace.address}.${CONTRACTS.marketplace.name}`,
  ROYALTY_DISTRIBUTOR: `${CONTRACTS.royaltyDistributor.address}.${CONTRACTS.royaltyDistributor.name}`
} as const;

// Fee constants (in basis points)
export const FEES = {
  PLATFORM_FEE: 250, // 2.5%
  MAX_ROYALTY: 1000, // 10%
  MIN_ROYALTY: 0,
  BASIS_POINTS_DIVISOR: 10000
} as const;

// Contract events for Chainhooks monitoring
export const CONTRACT_EVENTS = {
  MINT: 'mint',
  TRANSFER: 'transfer',
  LIST: 'list',
  UNLIST: 'unlist',
  PURCHASE: 'purchase',
  OFFER_MADE: 'offer-made',
  OFFER_ACCEPTED: 'offer-accepted',
  OFFER_CANCELLED: 'offer-cancelled',
  OFFER_REJECTED: 'offer-rejected'
} as const;
