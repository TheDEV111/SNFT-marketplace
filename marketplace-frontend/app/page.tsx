'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';

export default function Home() {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Create & Mint',
      description: 'Transform your digital art into NFTs with customizable royalties up to 10%',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Trade Freely',
      description: 'Buy, sell, and make offers on unique NFTs with low platform fees of 2.5%',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Transparent',
      description: 'Built on Stacks blockchain with SIP-009 compliant smart contracts',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Automatic Royalties',
      description: 'Creators earn automatically on every resale with smart royalty distribution',
    },
  ];

  const stats = [
    { label: 'NFTs Minted', value: '10K+' },
    { label: 'Total Volume', value: '500K STX' },
    { label: 'Active Users', value: '2.5K+' },
    { label: 'Collections', value: '150+' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight"
          >
            The Future of
            <br />
            Digital Ownership
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Discover, collect, and trade extraordinary NFTs on the most secure marketplace.
            Powered by Stacks blockchain for unmatched security and transparency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/demo">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg text-white shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all"
              >
                Try Live Demo
              </motion.button>
            </Link>

            <Link href="/marketplace">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-purple-500/50 rounded-xl font-bold text-lg text-white hover:bg-white/20 transition-all"
              >
                Explore Marketplace
              </motion.button>
            </Link>

            <Link href="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-purple-500/50 rounded-xl font-bold text-lg text-white hover:bg-white/20 transition-all"
              >
                Create NFT
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Why Choose SNFT?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built with cutting-edge technology and designed for creators and collectors
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-8 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 text-white">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/30">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Our Story
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-300 leading-relaxed mb-6"
            >
              In a world where digital art deserves recognition and fair compensation,
              SNFT Marketplace emerged as a beacon for creators and collectors. Built on
              the rock-solid foundation of the Stacks blockchain, we've created more than
              just a marketplace—we've built a community.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-lg text-gray-300 leading-relaxed mb-6"
            >
              Every NFT tells a story. Every transaction builds trust. With automatic
              royalties ensuring creators benefit from their work forever, and transparent
              smart contracts protecting every trade, we're not just changing how digital
              art is bought and sold—we're revolutionizing ownership itself.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-lg text-gray-300 leading-relaxed"
            >
              Join thousands of creators and collectors who have already discovered the
              future of digital ownership. Your journey starts here.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 container mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our vibrant community of creators and collectors today
            </p>
            <Link href="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all"
              >
                Create Your First NFT
              </motion.button>
            </Link>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-purple-500/20">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            © 2025 SNFT Marketplace. Built on Stacks Blockchain.
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            Secure • Transparent • Decentralized
          </p>
        </div>
      </footer>
    </div>
  );
}
