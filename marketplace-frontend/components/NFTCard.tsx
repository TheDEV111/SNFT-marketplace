'use client';

import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface NFTCardProps {
  nft: {
    id: number;
    name: string;
    image: string;
    price: number;
    seller: string;
    likes: number;
    collection: string;
  };
}

export default function NFTCard({ nft }: NFTCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(nft.likes);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Link href={`/nft/${nft.id}`}>
      <motion.div
        whileHover={{ y: -10 }}
        className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden cursor-pointer group"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <motion.img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  handleLike();
                }}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  isLiked
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  // Handle quick buy
                }}
                className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Collection Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-purple-600/80 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
              {nft.collection}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-2 truncate">{nft.name}</h3>

          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">by {nft.seller}</span>
            <div className="flex items-center gap-1 text-pink-400">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{likes}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
            <div>
              <p className="text-xs text-gray-400 mb-1">Price</p>
              <p className="text-xl font-bold text-white">
                {nft.price} STX
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                // Handle buy
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-sm font-semibold text-white"
            >
              Buy Now
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
