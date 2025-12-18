'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, SlidersHorizontal, Heart } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import NFTCard from '@/components/NFTCard';

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCollection, setSelectedCollection] = useState('all');

  // Mock NFT data - replace with real data from contract
  const mockNFTs = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Cool NFT #${i + 1}`,
    image: `https://picsum.photos/seed/${i}/400/400`,
    price: Math.floor(Math.random() * 10 + 1),
    seller: 'SP2X...',
    likes: Math.floor(Math.random() * 100),
    collection: i % 3 === 0 ? 'Abstract Art' : i % 3 === 1 ? 'Digital Dreams' : 'Pixel Perfect',
  }));

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />

      <div className="pt-32 pb-20 px-4 container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Explore Marketplace
          </h1>
          <p className="text-xl text-gray-400">
            Discover unique digital artworks from talented creators
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            {/* Collection Filter */}
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
            >
              <option value="all" className="bg-gray-900">All Collections</option>
              <option value="abstract" className="bg-gray-900">Abstract Art</option>
              <option value="digital" className="bg-gray-900">Digital Dreams</option>
              <option value="pixel" className="bg-gray-900">Pixel Perfect</option>
            </select>

            {/* Filter Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </motion.button>
          </div>

          {/* Price Range */}
          <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-white font-medium">Price Range (STX)</label>
              <span className="text-purple-400">
                {priceRange[0]} - {priceRange[1]} STX
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </motion.div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockNFTs.map((nft, index) => (
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

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/50 rounded-xl font-semibold text-white hover:bg-white/20 transition-all"
          >
            Load More
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
