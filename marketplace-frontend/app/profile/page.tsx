'use client';

import { motion } from 'framer-motion';
import { Copy, ExternalLink, Settings, Share2 } from 'lucide-react';
import { useState } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import NFTCard from '@/components/NFTCard';
import { useWalletStore } from '@/lib/wallet';

export default function ProfilePage() {
  const { address } = useWalletStore();
  const [activeTab, setActiveTab] = useState<'owned' | 'listed' | 'created' | 'offers'>('owned');

  // Mock data - replace with real contract data
  const profile = {
    address: address || 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
    username: 'CryptoArtist',
    bio: 'Digital artist and NFT collector. Creating unique pieces on the Stacks blockchain.',
    joined: 'January 2024',
    stats: {
      owned: 12,
      listed: 3,
      created: 8,
      volume: 45.5,
    },
  };

  const mockNFTs = {
    owned: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Owned NFT #${i + 1}`,
      image: `https://picsum.photos/seed/owned-${i}/400/400`,
      price: Math.floor(Math.random() * 10 + 1),
      seller: 'SP2X...',
      likes: Math.floor(Math.random() * 100),
      collection: 'My Collection',
    })),
    listed: Array.from({ length: 3 }, (_, i) => ({
      id: i + 20,
      name: `Listed NFT #${i + 1}`,
      image: `https://picsum.photos/seed/listed-${i}/400/400`,
      price: Math.floor(Math.random() * 10 + 1),
      seller: 'SP2X...',
      likes: Math.floor(Math.random() * 100),
      collection: 'For Sale',
    })),
    created: Array.from({ length: 8 }, (_, i) => ({
      id: i + 30,
      name: `Created NFT #${i + 1}`,
      image: `https://picsum.photos/seed/created-${i}/400/400`,
      price: Math.floor(Math.random() * 10 + 1),
      seller: 'SP2X...',
      likes: Math.floor(Math.random() * 100),
      collection: 'My Creations',
    })),
  };

  const offers = [
    {
      id: 1,
      nft: 'Cool NFT #5',
      image: 'https://picsum.photos/seed/offer-1/200/200',
      amount: 4.5,
      from: 'SP1X0TZ...',
      expiry: '2024-02-15',
      status: 'pending',
    },
    {
      id: 2,
      nft: 'Cool NFT #8',
      image: 'https://picsum.photos/seed/offer-2/200/200',
      amount: 3.8,
      from: 'SP2Y0TZ...',
      expiry: '2024-02-14',
      status: 'pending',
    },
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText(profile.address);
    alert('Address copied to clipboard!');
  };

  if (!address) {
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
              Please connect your wallet to view your profile and manage your NFTs
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

      <div className="pt-32 pb-20 px-4 container mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-5xl font-bold text-white">
                {profile.username[0]}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">{profile.username}</h1>
                <p className="text-gray-300 mb-4">{profile.bio}</p>

                {/* Address */}
                <div className="flex items-center gap-3 mb-4">
                  <code className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-lg text-sm text-purple-400 font-mono">
                    {profile.address.substring(0, 10)}...
                    {profile.address.substring(profile.address.length - 8)}
                  </code>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={copyAddress}
                    className="p-2 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white hover:bg-white/20 transition-all"
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white hover:bg-white/20 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </div>

                <p className="text-sm text-gray-400">Joined {profile.joined}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white flex items-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Edit Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl font-semibold text-white hover:bg-white/20 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white">
                  {profile.stats.owned}
                </p>
                <p className="text-gray-400 text-sm mt-1">Owned</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white">
                  {profile.stats.listed}
                </p>
                <p className="text-gray-400 text-sm mt-1">Listed</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white">
                  {profile.stats.created}
                </p>
                <p className="text-gray-400 text-sm mt-1">Created</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white">
                  {profile.stats.volume}
                </p>
                <p className="text-gray-400 text-sm mt-1">STX Volume</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Tab Headers */}
          <div className="flex gap-4 mb-8 overflow-x-auto">
            {(['owned', 'listed', 'created', 'offers'] as const).map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/10 backdrop-blur-sm border border-purple-500/30 text-gray-400 hover:text-white hover:bg-white/20'
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          {(activeTab === 'owned' || activeTab === 'listed' || activeTab === 'created') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockNFTs[activeTab].map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <NFTCard nft={nft} />
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="space-y-4">
              {offers.map((offer) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* NFT Image */}
                    <img
                      src={offer.image}
                      alt={offer.nft}
                      className="w-24 h-24 rounded-xl object-cover"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{offer.nft}</h3>
                      <p className="text-gray-400 text-sm mb-2">Offer from {offer.from}</p>
                      <p className="text-2xl font-bold text-white">
                        {offer.amount} STX
                      </p>
                      <p className="text-sm text-gray-400 mt-1">Expires {offer.expiry}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white"
                      >
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl font-semibold text-white hover:bg-white/20 transition-all"
                      >
                        Decline
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {offers.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No offers yet</p>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {(activeTab === 'owned' || activeTab === 'listed' || activeTab === 'created') &&
            mockNFTs[activeTab].length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No NFTs found</p>
              </div>
            )}
        </motion.div>
      </div>
    </div>
  );
}
