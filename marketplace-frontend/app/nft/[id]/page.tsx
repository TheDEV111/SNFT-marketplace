'use client';

import { motion } from 'framer-motion';
import { Heart, Share2, MoreVertical, Clock, Tag } from 'lucide-react';
import { useState } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { useWalletStore } from '@/lib/wallet';
import { buyNFT, makeOffer } from '@/lib/contract-calls';

export default function NFTDetailPage({ params }: { params: { id: string } }) {
  const { address } = useWalletStore();
  const [offerAmount, setOfferAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'offers' | 'history'>('details');

  // Mock NFT data - replace with real data from contract
  const nft = {
    id: params.id,
    name: `Cool NFT #${params.id}`,
    image: `https://picsum.photos/seed/${params.id}/800/800`,
    price: 5.5,
    seller: 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
    owner: 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
    collection: 'Abstract Art',
    description: 'A unique piece of digital art representing the convergence of technology and creativity. This NFT is part of an exclusive collection.',
    royalty: 5,
    properties: [
      { trait: 'Background', value: 'Purple Gradient' },
      { trait: 'Style', value: 'Abstract' },
      { trait: 'Rarity', value: 'Rare' },
      { trait: 'Edition', value: '1/100' },
    ],
  };

  const offers = [
    { id: 1, from: 'SP1X...', amount: 4.5, expiry: '2024-02-15' },
    { id: 2, from: 'SP2Y...', amount: 4.2, expiry: '2024-02-14' },
  ];

  const history = [
    { type: 'Listed', from: 'Owner', to: '---', price: 5.5, date: '2024-01-10' },
    { type: 'Transfer', from: 'SP1X...', to: 'SP2X...', price: 4.0, date: '2024-01-05' },
    { type: 'Minted', from: '---', to: 'SP1X...', price: 0, date: '2024-01-01' },
  ];

  const handleBuy = async () => {
    if (!address) return;
    try {
      await buyNFT(params.id, nft.price.toString(), address);
      alert('Purchase successful!');
    } catch {
      alert('Purchase failed');
    }
  };

  const handleMakeOffer = async () => {
    if (!address || !offerAmount) return;
    try {
      await makeOffer(params.id, offerAmount, address, '2024-12-31');
      alert('Offer submitted!');
      setOfferAmount('');
    } catch {
      alert('Offer failed');
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />

      <div className="pt-32 pb-20 px-4 container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="sticky top-32">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-purple-500/20">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Properties */}
              <div className="mt-6 bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-400" />
                  Properties
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {nft.properties.map((prop, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-purple-500/20 rounded-xl p-3"
                    >
                      <p className="text-xs text-gray-400 mb-1">{prop.trait}</p>
                      <p className="text-sm font-semibold text-white">{prop.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Collection Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-4 py-2 bg-purple-600/80 backdrop-blur-sm rounded-full text-sm font-semibold text-white">
                {nft.collection}
              </span>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white hover:bg-white/20 transition-all"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white hover:bg-white/20 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white hover:bg-white/20 transition-all"
                >
                  <MoreVertical className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold text-white mb-4">{nft.name}</h1>

            {/* Owner */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
              <div>
                <p className="text-sm text-gray-400">Owned by</p>
                <p className="text-white font-semibold">{nft.owner.substring(0, 10)}...</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-8 leading-relaxed">{nft.description}</p>

            {/* Price Box */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Current Price</p>
                  <p className="text-4xl font-bold text-white">
                    {nft.price} STX
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">Royalty</p>
                  <p className="text-2xl font-bold text-white">{nft.royalty}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuy}
                  disabled={!address}
                  className="py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="py-4 bg-white/10 backdrop-blur-sm border border-purple-500/50 rounded-xl font-bold text-white hover:bg-white/20 transition-all"
                >
                  Make Offer
                </motion.button>
              </div>
            </div>

            {/* Make Offer Form */}
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Make an Offer</h3>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Amount in STX"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMakeOffer}
                  disabled={!address || !offerAmount}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-purple-500/20">
                {(['details', 'offers', 'history'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-4 font-semibold capitalize transition-all ${
                      activeTab === tab
                        ? 'text-white bg-purple-600/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Contract Address</span>
                      <span className="text-white font-mono text-sm">
                        {nft.seller.substring(0, 20)}...
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Token ID</span>
                      <span className="text-white font-semibold">{nft.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Token Standard</span>
                      <span className="text-white font-semibold">SIP-009</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Blockchain</span>
                      <span className="text-white font-semibold">Stacks</span>
                    </div>
                  </div>
                )}

                {activeTab === 'offers' && (
                  <div className="space-y-3">
                    {offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="flex items-center justify-between p-4 bg-white/5 border border-purple-500/20 rounded-xl"
                      >
                        <div>
                          <p className="text-white font-semibold">{offer.amount} STX</p>
                          <p className="text-sm text-gray-400">from {offer.from}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Expires {offer.expiry}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-3">
                    {history.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white/5 border border-purple-500/20 rounded-xl"
                      >
                        <div>
                          <p className="text-white font-semibold">{event.type}</p>
                          <p className="text-sm text-gray-400">
                            {event.from} → {event.to}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">
                            {event.price > 0 ? `${event.price} STX` : '---'}
                          </p>
                          <p className="text-sm text-gray-400">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
