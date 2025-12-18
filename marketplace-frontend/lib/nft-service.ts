'use client';

import { cvToValue, hexToCV } from '@stacks/transactions';
import { NFT_TOKEN, MARKETPLACE, ROYALTY_DISTRIBUTOR, STACKS_MAINNET } from './contracts';

export interface NFTMetadata {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  owner: string;
  tokenUri: string;
  royalty: number;
  collection?: string;
  properties?: Array<{ trait: string; value: string }>;
}

export interface NFTListing {
  tokenId: string;
  price: number;
  seller: string;
  listed: boolean;
  tokenUri: string;
}

export interface NFTOffer {
  tokenId: string;
  buyer: string;
  amount: number;
  expiry: string;
  seller: string;
}

const API_BASE = 'https://api.mainnet.hiro.so';

/**
 * Fetch NFT owner from contract
 */
export async function getNFTOwner(tokenId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${API_BASE}/v2/contracts/call-read/${NFT_TOKEN.split('.')[0]}/${NFT_TOKEN.split('.')[1]}/get-owner`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: NFT_TOKEN.split('.')[0],
          arguments: [`0x${Buffer.from(tokenId).toString('hex')}`],
        }),
      }
    );

    const data = await response.json();
    if (data.okay && data.result) {
      const value = cvToValue(hexToCV(data.result));
      return value.value || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching NFT owner:', error);
    return null;
  }
}

/**
 * Fetch NFT token URI from contract
 */
export async function getTokenURI(tokenId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${API_BASE}/v2/contracts/call-read/${NFT_TOKEN.split('.')[0]}/${NFT_TOKEN.split('.')[1]}/get-token-uri`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: NFT_TOKEN.split('.')[0],
          arguments: [`0x${Buffer.from(tokenId).toString('hex')}`],
        }),
      }
    );

    const data = await response.json();
    if (data.okay && data.result) {
      const value = cvToValue(hexToCV(data.result));
      return value.value || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching token URI:', error);
    return null;
  }
}

/**
 * Fetch NFT listing from marketplace contract
 */
export async function getNFTListing(tokenId: string): Promise<NFTListing | null> {
  try {
    const response = await fetch(
      `${API_BASE}/v2/contracts/call-read/${MARKETPLACE.split('.')[0]}/${MARKETPLACE.split('.')[1]}/get-listing`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: MARKETPLACE.split('.')[0],
          arguments: [`0x${Buffer.from(tokenId).toString('hex')}`],
        }),
      }
    );

    const data = await response.json();
    if (data.okay && data.result) {
      const value = cvToValue(hexToCV(data.result));
      if (value.value) {
        return {
          tokenId,
          price: Number(value.value.price) / 1000000, // Convert from µSTX
          seller: value.value.seller,
          listed: value.value.listed,
          tokenUri: value.value['token-uri'],
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching NFT listing:', error);
    return null;
  }
}

/**
 * Fetch metadata from IPFS or HTTP
 */
export async function fetchMetadata(tokenUri: string): Promise<Partial<NFTMetadata> | null> {
  try {
    // Handle IPFS URIs
    let url = tokenUri;
    if (tokenUri.startsWith('ipfs://')) {
      url = tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }

    const response = await fetch(url);
    const metadata = await response.json();
    
    return {
      name: metadata.name,
      description: metadata.description,
      image: metadata.image?.startsWith('ipfs://') 
        ? metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
        : metadata.image,
      properties: metadata.attributes || metadata.properties || [],
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
}

/**
 * Get complete NFT data including ownership, listing, and metadata
 */
export async function getNFTData(tokenId: string): Promise<NFTMetadata | null> {
  try {
    const [owner, tokenUri, listing] = await Promise.all([
      getNFTOwner(tokenId),
      getTokenURI(tokenId),
      getNFTListing(tokenId),
    ]);

    if (!owner || !tokenUri) return null;

    const metadata = await fetchMetadata(tokenUri);

    return {
      tokenId,
      owner,
      tokenUri,
      name: metadata?.name || `NFT #${tokenId}`,
      description: metadata?.description || '',
      image: metadata?.image || '',
      royalty: 5, // Default, should fetch from contract
      properties: metadata?.properties || [],
    };
  } catch (error) {
    console.error('Error fetching NFT data:', error);
    return null;
  }
}

/**
 * Get all listed NFTs from marketplace
 */
export async function getMarketplaceNFTs(): Promise<NFTListing[]> {
  try {
    // This would need to track listings via events/database
    // For now, return mock data structure
    const listings: NFTListing[] = [];
    
    // In production, you'd query your database or use Chainhooks
    // to track all NFT listings
    
    return listings;
  } catch (error) {
    console.error('Error fetching marketplace NFTs:', error);
    return [];
  }
}

/**
 * Get user's NFT balance
 */
export async function getUserNFTBalance(address: string): Promise<number> {
  try {
    const response = await fetch(
      `${API_BASE}/extended/v1/address/${address}/nft?limit=1`
    );
    const data = await response.json();
    return data.total || 0;
  } catch (error) {
    console.error('Error fetching user NFT balance:', error);
    return 0;
  }
}

/**
 * Get user's owned NFTs
 */
export async function getUserNFTs(address: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${API_BASE}/extended/v1/address/${address}/nft?limit=50`
    );
    const data = await response.json();
    
    if (data.nfts) {
      return data.nfts
        .filter((nft: any) => nft.asset_identifier.startsWith(NFT_TOKEN))
        .map((nft: any) => nft.value.hex);
    }
    return [];
  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    return [];
  }
}

/**
 * Get transaction history for an NFT
 */
export async function getNFTHistory(tokenId: string): Promise<Array<any>> {
  try {
    // Query transactions involving this NFT
    const response = await fetch(
      `${API_BASE}/extended/v1/address/${NFT_TOKEN.split('.')[0]}/transactions?limit=50`
    );
    const data = await response.json();
    
    // Filter for transactions involving this specific token
    return data.results || [];
  } catch (error) {
    console.error('Error fetching NFT history:', error);
    return [];
  }
}
