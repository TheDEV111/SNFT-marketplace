# NFT Marketplace - Functional Demo

## 🎯 Overview

This demo page showcases the complete integration between the frontend and smart contracts on the Stacks blockchain. It demonstrates the full NFT lifecycle: minting, listing, and purchasing.

## 🚀 Features Implemented

### 1. **Mint NFT** Tab
- Create new NFTs with metadata
- Set custom royalty percentage (0-10%)
- Upload to IPFS (simulated in demo)
- Direct contract interaction via `mintNFT()`

### 2. **List NFT** Tab
- View your owned NFTs
- Set listing price in STX
- List NFTs on the marketplace
- Direct contract interaction via `listNFT()`

### 3. **Buy NFT** Tab
- Search for NFTs by token ID
- Load NFT metadata from blockchain
- View NFT details and owner
- Purchase listed NFTs
- Direct contract interaction via `buyNFT()`

## 📋 How to Use

### Prerequisites
1. Install Hiro Wallet browser extension
2. Create/import a Stacks wallet
3. Ensure you have testnet STX for transactions

### Step-by-Step Guide

#### Minting an NFT
1. Navigate to `/demo` page
2. Connect your wallet
3. Click on "Mint NFT" tab
4. Fill in:
   - **Name**: Your NFT's name
   - **Description**: What your NFT represents
   - **Image URL**: Direct URL or IPFS link
   - **Royalty**: Slide to set percentage (0-10%)
5. Click "Mint NFT"
6. Approve transaction in Hiro Wallet
7. Wait for confirmation

#### Listing an NFT
1. Click on "List NFT" tab
2. Select an NFT you own from dropdown
3. Enter listing price in STX
4. Click "List NFT"
5. Approve transaction in wallet
6. NFT is now available for purchase

#### Buying an NFT
1. Click on "Buy NFT" tab
2. Enter a token ID
3. Click "Load" to fetch NFT data
4. Review NFT details
5. Click "Buy NFT"
6. Approve transaction
7. NFT transfers to your wallet

## 🔗 Smart Contract Integration

### Contract Functions Used

#### `mintNFT(tokenUri, recipient, royalty)`
```typescript
import { mintNFT } from '@/lib/contract-calls';

await mintNFT(
  'ipfs://Qm...', // Token metadata URI
  'SP2X0TZ...', // Recipient address
  '5'           // Royalty percentage
);
```

#### `listNFT(tokenId, price, seller, tokenUri)`
```typescript
import { listNFT } from '@/lib/contract-calls';

await listNFT(
  '1',          // Token ID
  '10.0',       // Price in STX
  'SP2X0TZ...', // Seller address
  'ipfs://Qm...' // Token URI
);
```

#### `buyNFT(tokenId, price, seller)`
```typescript
import { buyNFT } from '@/lib/contract-calls';

await buyNFT(
  '1',          // Token ID
  '10.0',       // Price in STX
  'SP2X0TZ...'  // Seller address
);
```

### Reading from Blockchain

#### Get NFT Owner
```typescript
import { getNFTOwner } from '@/lib/nft-service';

const owner = await getNFTOwner('1');
console.log(owner); // 'SP2X0TZ...'
```

#### Get NFT Metadata
```typescript
import { getNFTData } from '@/lib/nft-service';

const nft = await getNFTData('1');
console.log(nft);
// {
//   tokenId: '1',
//   name: 'My NFT',
//   description: '...',
//   image: 'https://...',
//   owner: 'SP2X0TZ...',
//   ...
// }
```

#### Get User's NFTs
```typescript
import { getUserNFTs } from '@/lib/nft-service';

const nfts = await getUserNFTs('SP2X0TZ...');
console.log(nfts); // ['1', '5', '12']
```

## 🏗️ Architecture

### Data Flow

```
User Action → Frontend Component → Contract Call Helper → @stacks/connect
                                                              ↓
                                                        Smart Contract
                                                              ↓
                                                    Transaction Broadcast
                                                              ↓
                                                      Stacks Blockchain
```

### Reading Data Flow

```
Frontend Request → NFT Service → Stacks API → Smart Contract Read-Only Call
                                     ↓
                                  Response
                                     ↓
                            Process & Format Data
                                     ↓
                                Update UI
```

## 🔧 Technical Details

### Contract Addresses
```typescript
NFT_TOKEN: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.nft-token'
MARKETPLACE: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.marketplace'
ROYALTY_DISTRIBUTOR: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.royalty-distributor'
```

### API Endpoints
- **Mainnet API**: `https://api.mainnet.hiro.so`
- **Contract Read**: `/v2/contracts/call-read/{contract}/{function}`
- **NFT Holdings**: `/extended/v1/address/{address}/nft`

### Transaction Flow
1. User initiates action (mint/list/buy)
2. Frontend validates input
3. Constructs contract call with proper CV types
4. Opens transaction popup via @stacks/connect
5. User approves in wallet
6. Transaction broadcasts to blockchain
7. Confirmation received
8. UI updates with success/error status

## 📊 State Management

### Wallet State (Zustand)
```typescript
{
  address: string | null,
  isConnected: boolean,
  userData: any | null,
  connectWallet: () => void,
  disconnectWallet: () => void,
  checkConnection: () => void
}
```

### Transaction States
- **idle**: No transaction in progress
- **loading**: Transaction pending approval
- **success**: Transaction confirmed
- **error**: Transaction failed

## 🎨 UI Components

### Status Indicators
- **Loader**: Spinning icon during processing
- **Success**: Green checkmark on completion
- **Error**: Red X on failure

### Form Validation
- Required fields checked before submission
- Wallet connection verified
- Input types validated
- Price constraints enforced

## 🐛 Troubleshooting

### Common Issues

**"Please connect your wallet"**
- Solution: Click "Connect Wallet" in navbar and approve connection

**"Transaction failed"**
- Check you have sufficient STX
- Verify contract addresses are correct
- Ensure NFT exists and is owned by you (for listing)

**"NFT not found"**
- Verify token ID is correct
- Check NFT exists on blockchain
- Ensure reading from correct network

**"Wallet not responding"**
- Refresh page
- Reconnect wallet
- Check Hiro Wallet extension is unlocked

## 📈 Future Enhancements

- [ ] IPFS file upload integration
- [ ] Image preview during minting
- [ ] NFT property/trait editor
- [ ] Batch operations
- [ ] Price history charts
- [ ] Transaction history viewer
- [ ] Offer management system
- [ ] Collection creation

## 🔐 Security Notes

- Always verify contract addresses before transactions
- Double-check recipient addresses
- Review transaction details in wallet popup
- Never share your private keys or seed phrase
- Use testnet for development/testing

## 📚 Resources

- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Language Reference](https://docs.stacks.co/clarity)
- [Hiro Wallet](https://wallet.hiro.so)
- [SIP-009 NFT Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md)

---

**Demo Page**: http://localhost:3000/demo

**Status**: ✅ Fully Functional

**Last Updated**: December 18, 2025
