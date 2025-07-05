"use client";

import { ProcessedImage } from '@/app/remove-bg/page';
import { useState } from 'react';
import JSZip from 'jszip';
import ImageTouchup from './ImageTouchup';

interface BackgroundRemovalResultProps {
  images: ProcessedImage[];
}

export default function BackgroundRemovalResult({ images }: BackgroundRemovalResultProps) {
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [editingImage, setEditingImage] = useState<ProcessedImage | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadSingle = (image: ProcessedImage) => {
    const link = document.createElement('a');
    link.href = image.processedUrl;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = async () => {
    if (images.length === 0) return;
    
    setDownloadingAll(true);
    
    try {
      const zip = new JSZip();
      
      for (const image of images) {
        const response = await fetch(image.processedUrl);
        const blob = await response.blob();
        zip.file(image.name, blob);
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'background-removed-images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error creating ZIP:', error);
      alert('Error creating download. Please try again.');
    } finally {
      setDownloadingAll(false);
    }
  };

  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalProcessedSize = images.reduce((sum, img) => sum + img.processedSize, 0);

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-semibold text-black">{images.length}</div>
          <div className="text-sm text-gray-600">Images Processed</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-lg font-medium text-black">{formatFileSize(totalOriginalSize)}</div>
          <div className="text-sm text-gray-600">Original Size</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-lg font-medium text-black">{formatFileSize(totalProcessedSize)}</div>
          <div className="text-sm text-gray-600">Processed Size</div>
        </div>
      </div>

      {/* Download All Button */}
      <div className="flex justify-center">
        <button 
          className={`
            bg-black text-white px-6 py-3 rounded-md font-medium transition-all duration-200
            ${downloadingAll 
              ? 'opacity-75 cursor-not-allowed' 
              : 'hover:bg-gray-800 active:bg-gray-900'
            }
          `}
          onClick={downloadAll}
          disabled={downloadingAll}
        >
          {downloadingAll ? (
            <span className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating ZIP...</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <span>📦</span>
              <span>Download All as ZIP</span>
            </span>
          )}
        </button>
      </div>

      {/* Individual Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Original Image */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">Before</p>
                  <img 
                    src={image.originalUrl} 
                    alt="Original" 
                    className="w-full h-20 object-cover rounded border border-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(image.originalSize)}
                  </p>
                </div>
                
                {/* Processed Image */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">After</p>
                  <div className="relative">
                    <img 
                      src={image.processedUrl} 
                      alt="Background Removed" 
                      className="w-full h-20 object-cover rounded border border-gray-200"
                      style={{ 
                        background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                        backgroundSize: '10px 10px',
                        backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(image.processedSize)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-black text-sm truncate">{image.name}</h3>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Background:</span>
                  <span className="font-semibold text-green-600">
                    ✂️ Removed
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: '100%' }}
                  ></div>
                </div>
                
                <div className="space-y-2">
                  <button 
                    className="w-full bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded-md text-sm font-medium transition-colors"
                    onClick={() => downloadSingle(image)}
                  >
                    📥 Download PNG
                  </button>
                  <button 
                    className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-md text-sm font-medium transition-colors"
                    onClick={() => setEditingImage(image)}
                  >
                    ✏️ Touch Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Touch-up Modal */}
      {editingImage && (
        <ImageTouchup
          originalImageUrl={editingImage.originalUrl}
          processedImageUrl={editingImage.processedUrl}
          onSave={(editedUrl) => {
            // Update the image with the edited version
            editingImage.processedUrl = editedUrl;
            setEditingImage(null);
          }}
          onCancel={() => setEditingImage(null)}
        />
      )}
    </div>
  );
} 