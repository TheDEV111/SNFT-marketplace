# SNFT Marketplace - NFT Trading Platform on Stacks Blockchain

A fully functional NFT marketplace built with Clarity smart contracts on the Stacks blockchain and a Next.js frontend featuring beautiful animations and seamless wallet integration.

## 🚀 Features

### Smart Contracts (Clarity 2.0)
- **SIP-009 Compliant NFT Token** - Standard-compliant NFT with mint, transfer, and burn functionality
- **Marketplace Contract** - Complete trading platform with listing, buying, and offer management
- **Royalty Distributor** - Automatic royalty payments to creators on secondary sales
- **Platform Fee System** - 2.5% platform fee on all transactions
- **Offer Management** - Make, accept, and cancel offers with expiry dates

### Frontend (Next.js 14 + TypeScript)
- **Animated UI** - Smooth animations with Framer Motion and custom particle background
- **Wallet Integration** - Seamless connection with Hiro Wallet using @stacks/connect
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Multiple Pages**:
  - Homepage with storytelling
  - Marketplace with filtering and search
  - NFT detail pages with offer management
  - Minting interface with drag-drop upload
  - User profile with portfolio management

## 📁 Project Structure

```
SNFT-marketplace/
├── nft-market-place/              # Smart contract workspace
│   ├── contracts/
│   │   ├── nft-token.clar         # SIP-009 NFT contract
│   │   ├── marketplace.clar        # Trading platform
│   │   └── royalty-distributor.clar # Royalty system
│   ├── tests/                     # Comprehensive test suites
│   ├── Clarinet.toml              # Clarinet configuration
│   └── settings/                  # Network configurations
│
└── marketplace-frontend/          # Next.js frontend
    ├── app/                       # App router pages
    │   ├── page.tsx               # Homepage
    │   ├── marketplace/page.tsx   # NFT grid view
    │   ├── nft/[id]/page.tsx      # NFT details
    │   ├── create/page.tsx        # Minting interface
    │   └── profile/page.tsx       # User profile
    ├── components/                # React components
    │   ├── AnimatedBackground.tsx # Particle animation
    │   ├── Navbar.tsx             # Navigation bar
    │   └── NFTCard.tsx            # NFT card component
    └── lib/                       # Utilities
        ├── contracts.ts           # Contract addresses
        ├── wallet.ts              # Wallet state management
        └── contract-calls.ts      # Smart contract interactions
```

## 🛠️ Technology Stack

### Backend
- **Clarity 2.0** - Smart contract language
- **Clarinet** - Development and testing framework
- **Stacks Blockchain** - Layer-1 blockchain for Bitcoin

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **@stacks/connect** - Wallet integration
- **Zustand** - State management
- **Lucide React** - Icon library

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Clarinet CLI (for smart contract development)
- Hiro Wallet browser extension

### Clone Repository
```bash
git clone https://github.com/yourusername/SNFT-marketplace.git
cd SNFT-marketplace
```

### Smart Contracts Setup
```bash
cd nft-market-place
clarinet check
clarinet test
```

### Frontend Setup
```bash
cd marketplace-frontend
npm install
npm run dev
```

The application will be available at http://localhost:3000

## 🚢 Deployment

### Smart Contracts
The contracts are deployed to Stacks Mainnet with the following addresses:

**Contract Address:** `SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F`

- **nft-token**: SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.nft-token
- **marketplace**: SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.marketplace
- **royalty-distributor**: SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.royalty-distributor

**Total Deployment Cost:** 0.45 STX (150,000 µSTX per contract)

### Frontend Deployment
The frontend can be deployed to Vercel, Netlify, or any Node.js hosting platform:

```bash
npm run build
npm start
```

## 💡 Usage Guide

### For Creators
1. **Connect Wallet** - Click "Connect Wallet" in the navbar
2. **Create NFT** - Navigate to the Create page
3. **Upload Artwork** - Drag and drop your image file
4. **Set Metadata** - Add name, description, and properties
5. **Set Royalty** - Choose royalty percentage (0-10%)
6. **Set Price** - Optional initial listing price
7. **Mint NFT** - Confirm transaction in wallet

### For Collectors
1. **Browse Marketplace** - Explore available NFTs
2. **Filter & Search** - Use filters to find specific items
3. **View Details** - Click any NFT for full information
4. **Buy NFT** - Purchase directly at listing price
5. **Make Offer** - Submit custom offer if not listed
6. **Manage Portfolio** - View owned NFTs in profile

### For Sellers
1. **List NFT** - Set price for owned NFT
2. **Manage Offers** - Accept or decline incoming offers
3. **Update Listing** - Change price or unlist NFT
4. **Track Sales** - View transaction history

## 📝 Smart Contract Functions

### NFT Token Contract
- `mint(token-uri, recipient)` - Mint new NFT
- `transfer(token-id, sender, recipient)` - Transfer ownership
- `approve(token-id, spender)` - Approve spender
- `burn(token-id)` - Burn NFT

### Marketplace Contract
- `list-nft(token-id, price, token-uri)` - List NFT for sale
- `buy-nft(token-id, seller)` - Purchase listed NFT
- `unlist-nft(token-id)` - Remove listing
- `make-offer(token-id, seller, amount, expiry)` - Create offer
- `accept-offer(token-id, buyer)` - Accept offer
- `cancel-offer(token-id, seller)` - Cancel offer

### Royalty Distributor Contract
- `set-token-royalty(nft-contract, token-id, creator, royalty-percent)` - Set royalty
- `distribute-payment(nft-contract, token-id, total-amount, buyer, seller)` - Distribute payment

## 🧪 Testing

Run comprehensive test suite:
```bash
cd nft-market-place
clarinet test
```

**Test Coverage:**
- 36+ test cases
- NFT minting and transfers
- Marketplace operations
- Offer management
- Royalty distribution
- Edge cases and security

## 🎨 Design Features

### Theme
- **Purple to Pink Gradient** - Modern, eye-catching color scheme
- **Glass Morphism** - Frosted glass effect with backdrop blur
- **Smooth Animations** - Framer Motion transitions
- **Particle Background** - Dynamic animated canvas

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly buttons and interactions

## 🔒 Security Features

- Input validation on all contract functions
- Ownership checks before transfers
- Expiry validation for offers
- Safe STX transfer with error handling
- Platform fee limits (max 10%)
- Royalty limits (max 10%)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Stacks Foundation for blockchain infrastructure
- Hiro Systems for development tools
- Clarity language documentation and community

## 📧 Contact

For questions or support, please open an issue or contact:
- Email: support@snftmarketplace.com
- Twitter: @SNFTMarketplace
- Discord: discord.gg/snft

## 🗺️ Roadmap

### Phase 1 (Completed) ✅
- Smart contract development
- Frontend implementation
- Wallet integration
- Basic marketplace functionality

### Phase 2 (In Progress)
- IPFS integration for metadata storage
- Real-time blockchain event monitoring with Chainhooks
- Advanced filtering and sorting
- Collection management

### Phase 3 (Planned)
- Auction functionality
- Batch minting
- Social features (likes, comments)
- Analytics dashboard
- Mobile app

---

**Built with ❤️ by Senior Blockchain Engineers on Stacks Blockchain**
