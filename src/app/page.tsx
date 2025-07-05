"use client";

import { useState } from 'react';
import ImageDropzone from '@/components/ImageDropzone';
import ConversionResult from '@/components/ConversionResult';

export interface ConvertedImage {
  name: string;
  originalSize: number;
  webpSize: number;
  url: string;
  originalUrl: string;
}

export default function Home() {
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleImagesConverted = (images: ConvertedImage[]) => {
    setConvertedImages(prev => [...prev, ...images]);
  };

  const handleClearAll = () => {
    setConvertedImages([]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <h1 className="text-lg sm:text-xl font-medium text-black">
                Image to WebP Converter
              </h1>
            </div>
            <a 
              href="https://revanpratamas.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-black transition-colors self-start sm:self-auto"
            >
              revanpratamas.com →
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-black mb-4 sm:mb-6 leading-tight">
            Convert Images to WebP
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Reduce your image file sizes by up to 80% while maintaining quality. 
            Support for single images and bulk conversion via ZIP files.
          </p>
        </div>

        {/* Dropzone */}
        <div className="mb-12 sm:mb-16">
          <ImageDropzone 
            onImagesConverted={handleImagesConverted}
            isConverting={isConverting}
            setIsConverting={setIsConverting}
          />
        </div>

        {/* Results */}
        {convertedImages.length > 0 && (
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <h3 className="text-xl sm:text-2xl font-medium text-black">
                Results ({convertedImages.length} {convertedImages.length === 1 ? 'image' : 'images'})
              </h3>
              <button 
                className="text-sm text-gray-600 hover:text-black transition-colors border border-gray-300 px-4 py-2 rounded-md hover:border-gray-400 self-start sm:self-auto"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </div>
            
            <ConversionResult images={convertedImages} />
          </div>
        )}

        {/* Features */}
        <div className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg">
                ⚡
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Fast Conversion</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Lightning-fast image processing powered by Sharp.js
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg">
                📦
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Bulk Processing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Upload ZIP files for batch conversion
              </p>
            </div>
            
            <div className="text-center sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg">
                🔒
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Privacy First</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                All processing happens in your browser
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 sm:mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-600 space-y-4 sm:space-y-0">
            <p>© 2025 Revan Pratama. All rights reserved.</p>
            <div className="flex space-x-6">
              <a 
                href="https://github.com/revanp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
