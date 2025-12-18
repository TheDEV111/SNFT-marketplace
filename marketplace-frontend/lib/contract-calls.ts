import { openContractCall } from '@stacks/connect';
import { 
  uintCV, 
  stringAsciiCV, 
  principalCV,
  PostConditionMode 
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { CONTRACT_ADDRESSES } from './contracts';

const network = new StacksMainnet();

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

  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESSES.NFT_TOKEN.split('.')[0],
    contractName: CONTRACT_ADDRESSES.NFT_TOKEN.split('.')[1],
    functionName: 'mint',
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    onFinish: (data) => {
      console.log('Mint transaction:', data.txId);
      return data.txId;
    },
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

  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[0],
    contractName: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[1],
    functionName: 'list-nft',
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    onFinish: (data) => {
      console.log('List transaction:', data.txId);
      return data.txId;
    },
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

  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[0],
    contractName: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[1],
    functionName: 'buy-nft',
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    onFinish: (data) => {
      console.log('Buy transaction:', data.txId);
      return data.txId;
    },
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

  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[0],
    contractName: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[1],
    functionName: 'make-offer',
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    onFinish: (data) => {
      console.log('Offer transaction:', data.txId);
      return data.txId;
    },
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

  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[0],
    contractName: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[1],
    functionName: 'accept-offer',
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    onFinish: (data) => {
      console.log('Accept offer transaction:', data.txId);
      return data.txId;
    },
  });
};

// Unlist NFT
export const unlistNFT = async (listingId: number) => {
  const functionArgs = [uintCV(listingId)];

  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[0],
    contractName: CONTRACT_ADDRESSES.MARKETPLACE.split('.')[1],
    functionName: 'unlist-nft',
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    onFinish: (data) => {
      console.log('Unlist transaction:', data.txId);
      return data.txId;
    },
  });
};
