import { openContractCall } from '@stacks/connect';
import { 
  uintCV, 
  stringAsciiCV, 
  principalCV,
  PostConditionMode 
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { CONTRACT_ADDRESSES } from './contracts';

const network: StacksNetwork = {
  chainId: 1,
  coreApiUrl: 'https://api.mainnet.hiro.so',
  bnsLookupUrl: 'https://api.mainnet.hiro.so',
  broadcastEndpoint: '/v2/transactions',
  transferFeeEstimateEndpoint: '/v2/fees/transfer',
  accountEndpoint: '/v2/accounts',
  contractAbiEndpoint: '/v2/contracts/interface',
  readOnlyFunctionCallEndpoint: '/v2/contracts/call-read',
  isMainnet: () => true,
};

// Mint NFT
export const mintNFT = async (
  recipient: string,
  metadataUri: string,
  royaltyPercent: number
) => {
  const functionArgs = [
    principalCV(recipient),
    stringAsciiCV(metadataUri),
    uintCV(royaltyPercent)
  ];

  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESSES.NFT_TOKEN.split('.')[0],
      contractName: CONTRACT_ADDRESSES.NFT_TOKEN.split('.')[1],
      functionName: 'mint',
      functionArgs,
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Mint transaction:', data.txId);
        resolve(data.txId);
      },
      onCancel: () => {
        reject(new Error('User cancelled the transaction'));
      },
    });
  });
};

// List NFT for sale
export const listNFT = async (
  nftContract: string,
  tokenId: number,
  price: number,
  expiry: number
) => {
  const functionArgs = [
    principalCV(nftContract),
    uintCV(tokenId),
    uintCV(price),
    uintCV(expiry)
  ];

  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[0],
      contractName: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[1],
      functionName: 'list-nft',
      functionArgs,
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('List transaction:', data.txId);
        resolve(data.txId);
      },
      onCancel: () => {
        reject(new Error('User cancelled the transaction'));
      },
    });
  });
};

// Buy NFT
export const buyNFT = async (
  listingId: number,
  nftContract: string
) => {
  const functionArgs = [
    uintCV(listingId),
    principalCV(nftContract)
  ];

  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[0],
      contractName: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[1],
      functionName: 'buy-nft',
      functionArgs,
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Buy transaction:', data.txId);
        resolve(data.txId);
      },
      onCancel: () => {
        reject(new Error('User cancelled the transaction'));
      },
    });
  });
};

// Make offer
export const makeOffer = async (
  nftContract: string,
  tokenId: number,
  amount: number,
  expiry: number
) => {
  const functionArgs = [
    principalCV(nftContract),
    uintCV(tokenId),
    uintCV(amount),
    uintCV(expiry)
  ];

  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[0],
      contractName: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[1],
      functionName: 'make-offer',
      functionArgs,
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Offer transaction:', data.txId);
        resolve(data.txId);
      },
      onCancel: () => {
        reject(new Error('User cancelled the transaction'));
      },
    });
  });
};

// Accept offer
export const acceptOffer = async (
  offerId: number,
  nftContract: string
) => {
  const functionArgs = [
    uintCV(offerId),
    principalCV(nftContract)
  ];

  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[0],
      contractName: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[1],
      functionName: 'accept-offer',
      functionArgs,
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Accept offer transaction:', data.txId);
        resolve(data.txId);
      },
      onCancel: () => {
        reject(new Error('User cancelled the transaction'));
      },
    });
  });
};

// Unlist NFT
export const unlistNFT = async (listingId: number) => {
  const functionArgs = [uintCV(listingId)];

  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      contractAddress: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[0],
      contractName: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[1],
      functionName: 'unlist-nft',
      functionArgs,
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Unlist transaction:', data.txId);
        resolve(data.txId);
      },
      onCancel: () => {
        reject(new Error('User cancelled the transaction'));
      },
    });
  });
};
