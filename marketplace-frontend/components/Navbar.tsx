'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Menu, X } from 'lucide-react';
import { useWalletStore } from '@/lib/wallet';
import { useState } from 'react';

export default function Navbar() {
  const { isConnected, address, connectWallet, disconnectWallet, checkConnection } = useWalletStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const navItems = [
    { name: 'Demo', href: '/demo' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Create', href: '/create' },
    { name: 'Profile', href: '/profile' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-purple-500/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SNFT
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  {item.name}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected && address ? (
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-lg font-semibold text-white flex items-center space-x-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{truncateAddress(address)}</span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg font-semibold text-white transition-all"
                >
                  Disconnect
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white flex items-center space-x-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-4"
          >
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <div
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                >
                  {item.name}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
