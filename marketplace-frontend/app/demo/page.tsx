'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2, CheckCircle, XCircle } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { useWalletStore } from '@/lib/wallet';
import { mintNFT, listNFT, buyNFT } from '@/lib/contract-calls';
import { getNFTData, getUserNFTs, NFTMetadata } from '@/lib/nft-service';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';

export default function DemoPage() {
  const { address, isConnected } = useWalletStore();
  const [activeTab, setActiveTab] = useState<'mint' | 'list' | 'buy'>('mint');
  
  // Minting state
  const [mintName, setMintName] = useState('');
  const [mintDescription, setMintDescription] = useState('');
  const [mintImage, setMintImage] = useState('');
  const [mintRoyalty, setMintRoyalty] = useState(5);
  const [minting, setMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Listing state
  const [userNFTs, setUserNFTs] = useState<string[]>([]);
  const [selectedNFT, setSelectedNFT] = useState('');
  const [listPrice, setListPrice] = useState('');
  const [listing, setListing] = useState(false);
  const [listStatus, setListStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Buying state
  const [buyTokenId, setBuyTokenId] = useState('');
  const [buyNFTData, setBuyNFTData] = useState<NFTMetadata | null>(null);
  const [buying, setBuying] = useState(false);
  const [buyStatus, setBuyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loadingNFT, setLoadingNFT] = useState(false);

  // Load user's NFTs when connected
  useEffect(() => {
    if (address && activeTab === 'list') {
      loadUserNFTs();
    }
  }, [address, activeTab]);

  const loadUserNFTs = async () => {
    if (!address) return;
    const nfts = await getUserNFTs(address);
    setUserNFTs(nfts);
  };

  const handleMint = async () => {
    if (!address || !mintName || !mintImage) {
      alert('Please fill all required fields');
      return;
    }

    setMinting(true);
    setMintStatus('idle');

    try {
      // In production, upload to IPFS first
      const metadata = {
        name: mintName,
        description: mintDescription,
        image: mintImage,
        properties: [],
      };
      
      // For demo, use a mock IPFS URI
      const tokenUri = `ipfs://QmDemo${Date.now()}`;
      
      await mintNFT(address, tokenUri, mintRoyalty);
      
      setMintStatus('success');
      setTimeout(() => {
        setMintName('');
        setMintDescription('');
        setMintImage('');
        setMintStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Minting failed:', error);
      setMintStatus('error');
    } finally {
      setMinting(false);
    }
  };

  const handleList = async () => {
    if (!address || !selectedNFT || !listPrice) {
      alert('Please select an NFT and enter a price');
      return;
    }

    setListing(true);
    setListStatus('idle');

    try {
      const tokenId = Number(selectedNFT);
      const priceInMicroSTX = Number(listPrice) * 1000000;
      const expiryBlocks = 4320; // ~30 days
      await listNFT(CONTRACT_ADDRESSES.NFT_TOKEN, tokenId, priceInMicroSTX, expiryBlocks);
      
      setListStatus('success');
      setTimeout(() => {
        setSelectedNFT('');
        setListPrice('');
        setListStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Listing failed:', error);
      setListStatus('error');
    } finally {
      setListing(false);
    }
  };

  const loadNFTData = async () => {
    if (!buyTokenId) return;
    
    setLoadingNFT(true);
    try {
      const data = await getNFTData(buyTokenId);
      setBuyNFTData(data);
    } catch (error) {
      console.error('Error loading NFT:', error);
    } finally {
      setLoadingNFT(false);
    }
  };

  const handleBuy = async () => {
    if (!address || !buyTokenId || !buyNFTData) {
      alert('Please load an NFT first');
      return;
    }

    setBuying(true);
    setBuyStatus('idle');

    try {
      const tokenIdNumber = Number(buyTokenId);
      // Get listing price from contract
      await buyNFT(tokenIdNumber, CONTRACT_ADDRESSES.NFT_TOKEN);
      
      setBuyStatus('success');
      setTimeout(() => {
        setBuyTokenId('');
        setBuyNFTData(null);
        setBuyStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Purchase failed:', error);
      setBuyStatus('error');
    } finally {
      setBuying(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <Navbar />
        <div className="pt-32 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-12 text-center max-w-md"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Please connect your Stacks wallet to use the marketplace
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />

      <div className="pt-32 pb-20 px-4 container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-white">
            NFT Marketplace Demo
          </h1>
          <p className="text-xl text-gray-400">
            Functional integration with smart contracts
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          {(['mint', 'list', 'buy'] as const).map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {tab} NFT
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8"
        >
          {activeTab === 'mint' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Mint New NFT</h2>
              
              <div>
                <label className="text-white font-semibold mb-2 block">Name *</label>
                <input
                  type="text"
                  value={mintName}
                  onChange={(e) => setMintName(e.target.value)}
                  placeholder="My Awesome NFT"
                  className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">Description</label>
                <textarea
                  value={mintDescription}
                  onChange={(e) => setMintDescription(e.target.value)}
                  placeholder="Describe your NFT..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">Image URL *</label>
                <input
                  type="text"
                  value={mintImage}
                  onChange={(e) => setMintImage(e.target.value)}
                  placeholder="https://... or ipfs://..."
                  className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Royalty: {mintRoyalty}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={mintRoyalty}
                  onChange={(e) => setMintRoyalty(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <button
                onClick={handleMint}
                disabled={minting || !mintName || !mintImage}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {minting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Minting...
                  </>
                ) : mintStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Minted Successfully!
                  </>
                ) : mintStatus === 'error' ? (
                  <>
                    <XCircle className="w-5 h-5" />
                    Minting Failed
                  </>
                ) : (
                  'Mint NFT'
                )}
              </button>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">List NFT for Sale</h2>
              
              <div>
                <label className="text-white font-semibold mb-2 block">Select Your NFT *</label>
                <select
                  value={selectedNFT}
                  onChange={(e) => setSelectedNFT(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="" className="bg-gray-900">Select an NFT...</option>
                  {userNFTs.map((nft, i) => (
                    <option key={i} value={nft} className="bg-gray-900">
                      NFT #{nft.slice(0, 8)}...
                    </option>
                  ))}
                </select>
                {userNFTs.length === 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    No NFTs found. Mint one first!
                  </p>
                )}
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">Price (STX) *</label>
                <input
                  type="number"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  placeholder="10.0"
                  step="0.1"
                  className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={handleList}
                disabled={listing || !selectedNFT || !listPrice}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {listing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Listing...
                  </>
                ) : listStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Listed Successfully!
                  </>
                ) : listStatus === 'error' ? (
                  <>
                    <XCircle className="w-5 h-5" />
                    Listing Failed
                  </>
                ) : (
                  'List NFT'
                )}
              </button>
            </div>
          )}

          {activeTab === 'buy' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Buy Listed NFT</h2>
              
              <div>
                <label className="text-white font-semibold mb-2 block">Token ID *</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={buyTokenId}
                    onChange={(e) => setBuyTokenId(e.target.value)}
                    placeholder="Enter token ID..."
                    className="flex-1 px-4 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={loadNFTData}
                    disabled={loadingNFT || !buyTokenId}
                    className="px-6 py-3 bg-purple-600 rounded-xl font-semibold text-white disabled:opacity-50"
                  >
                    {loadingNFT ? 'Loading...' : 'Load'}
                  </button>
                </div>
              </div>

              {buyNFTData && (
                <div className="bg-white/5 border border-purple-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">{buyNFTData.name}</h3>
                  {buyNFTData.image && (
                    <img
                      src={buyNFTData.image}
                      alt={buyNFTData.name}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="text-gray-300 mb-4">{buyNFTData.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Owner:</span>
                    <span className="text-white font-mono">{buyNFTData.owner.slice(0, 10)}...</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBuy}
                disabled={buying || !buyNFTData}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {buying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Buying...
                  </>
                ) : buyStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Purchase Successful!
                  </>
                ) : buyStatus === 'error' ? (
                  <>
                    <XCircle className="w-5 h-5" />
                    Purchase Failed
                  </>
                ) : (
                  'Buy NFT'
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-2">Connected Contracts</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p><span className="text-purple-400">NFT Token:</span> {address}</p>
            <p><span className="text-purple-400">Marketplace:</span> {address}</p>
            <p><span className="text-purple-400">Royalty Distributor:</span> {address}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
