'use client';

import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, DollarSign, Percent, Info } from 'lucide-react';
import { useState, useRef } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { useWalletStore } from '@/lib/wallet';
import { mintNFT, listNFT } from '@/lib/contract-calls';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';

export default function CreatePage() {
  const { address } = useWalletStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    royalty: 5,
    collection: '',
    properties: [{ trait: '', value: '' }],
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addProperty = () => {
    setFormData({
      ...formData,
      properties: [...formData.properties, { trait: '', value: '' }],
    });
  };

  const updateProperty = (index: number, field: 'trait' | 'value', value: string) => {
    const newProperties = [...formData.properties];
    newProperties[index][field] = value;
    setFormData({ ...formData, properties: newProperties });
  };

  const removeProperty = (index: number) => {
    setFormData({
      ...formData,
      properties: formData.properties.filter((_, i) => i !== index),
    });
  };

  const handleMint = async () => {
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (!formData.name || !formData.description || !preview) {
      alert('Please fill all required fields');
      return;
    }

    try {
      // In production, upload to IPFS first
      const tokenUri = 'ipfs://...'; // Replace with actual IPFS upload
      await mintNFT(address, tokenUri, formData.royalty);

      // If price is set, list the NFT
      if (formData.price) {
        // Get the newly minted token ID from contract
        const tokenId = 1; // Replace with actual token ID from mint response
        const priceInMicroSTX = Number(formData.price) * 1000000;
        const expiryBlocks = 4320; // ~30 days
        await listNFT(CONTRACT_ADDRESSES.NFT_TOKEN, tokenId, priceInMicroSTX, expiryBlocks);
      }

      alert('NFT minted successfully!');
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        royalty: 5,
        collection: '',
        properties: [{ trait: '', value: '' }],
      });
      setPreview(null);
    } catch (error: any) {
      if (error.message && error.message.includes('cancelled')) {
        alert('Minting cancelled by user');
      } else {
        alert('Minting failed');
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />

      <div className="pt-32 pb-20 px-4 container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 text-white">
            Create Your NFT
          </h1>
          <p className="text-xl text-gray-400">
            Turn your digital art into a unique NFT on the Stacks blockchain
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Upload Area */}
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 mb-6">
              <label className="text-white font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                Upload Artwork *
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-square border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  isDragging
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-purple-500/30 hover:border-purple-500/60 bg-white/5'
                }`}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <Upload className="w-16 h-16 mb-4" />
                    <p className="text-lg font-semibold mb-2">Drop your file here</p>
                    <p className="text-sm">or click to browse</p>
                    <p className="text-xs mt-2">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Preview Info */}
            {preview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6"
              >
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-purple-400" />
                  Preview
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white font-semibold">
                      {formData.name || 'Untitled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-white font-semibold">
                      {formData.price ? `${formData.price} STX` : 'Not for sale'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Royalty:</span>
                    <span className="text-white font-semibold">{formData.royalty}%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Basic Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Basic Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My Awesome NFT"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your NFT..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Collection</label>
                  <input
                    type="text"
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    placeholder="Collection name (optional)"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-400" />
                Pricing
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Initial Price (STX)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.0"
                    step="0.1"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Leave empty to mint without listing for sale
                  </p>
                </div>

                <div>
                  <label className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Percent className="w-5 h-5 text-purple-400" />
                    Royalty: {formData.royalty}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={formData.royalty}
                    onChange={(e) =>
                      setFormData({ ...formData, royalty: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>0%</span>
                    <span>10%</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Earn {formData.royalty}% from future sales
                  </p>
                </div>
              </div>
            </div>

            {/* Properties */}
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Properties</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addProperty}
                  className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-semibold text-white"
                >
                  + Add
                </motion.button>
              </div>

              <div className="space-y-3">
                {formData.properties.map((prop, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={prop.trait}
                      onChange={(e) => updateProperty(index, 'trait', e.target.value)}
                      placeholder="Trait"
                      className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                    />
                    <input
                      type="text"
                      value={prop.value}
                      onChange={(e) => updateProperty(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeProperty(index)}
                      className="px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-xl text-red-400 hover:bg-red-600/30 transition-all"
                    >
                      ×
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMint}
              disabled={!address}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {address ? 'Mint NFT' : 'Connect Wallet to Mint'}
            </motion.button>

            <p className="text-center text-sm text-gray-400">
              Platform fee: 2.5% • Gas fees may apply
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
