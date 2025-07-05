"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { removeBackground } from '@imgly/background-removal';
import { ProcessedImage } from '@/app/remove-bg/page';

interface BackgroundRemovalDropzoneProps {
  onImagesProcessed: (images: ProcessedImage[]) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export default function BackgroundRemovalDropzone({ 
  onImagesProcessed, 
  isProcessing, 
  setIsProcessing 
}: BackgroundRemovalDropzoneProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [qualityMode, setQualityMode] = useState<'fast' | 'quality'>('quality');

  const removeImageBackground = async (file: File): Promise<ProcessedImage> => {
    // Create image URL for original
    const originalUrl = URL.createObjectURL(file);
    
    // Remove background using the library with better config
    const config = qualityMode === 'quality' ? {
      model: 'isnet' as const, // Use isnet model for better quality
      output: {
        quality: 0.9, // Higher quality output
        format: 'image/png' as const
      }
    } : {
      model: 'isnet_fp16' as const, // Faster model
      output: {
        quality: 0.8,
        format: 'image/png' as const
      }
    };
    
    const blob = await removeBackground(file, config);
    
    // Apply post-processing for better edges
    const processedBlob = await postProcessImage(blob);
    
    // Create URL for processed image
    const processedUrl = URL.createObjectURL(processedBlob);

    return {
      name: file.name.replace(/\.[^/.]+$/, '_no_bg.png'),
      originalSize: file.size,
      processedSize: processedBlob.size,
      originalUrl: originalUrl,
      processedUrl: processedUrl,
    };
  };

  const postProcessImage = async (blob: Blob): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply edge smoothing and alpha refinement
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          
          // Smooth edges by adjusting alpha values
          if (alpha > 0 && alpha < 255) {
            // For semi-transparent pixels, apply smoothing
            const smoothedAlpha = Math.min(255, alpha * 1.2);
            data[i + 3] = smoothedAlpha;
          }
          
          // Remove noise by setting very low alpha to 0
          if (alpha < 10) {
            data[i + 3] = 0;
          }
        }
        
        // Apply the processed image data back to canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to blob
        canvas.toBlob((processedBlob) => {
          resolve(processedBlob!);
        }, 'image/png', 1.0);
      };
      
      img.src = URL.createObjectURL(blob);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const filesToProcess = acceptedFiles.filter(file => file.type.startsWith('image/'));

      if (filesToProcess.length === 0) {
        throw new Error('No valid image files found');
      }

      const processedImages: ProcessedImage[] = [];
      const totalFiles = filesToProcess.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = filesToProcess[i];
        const processedImage = await removeImageBackground(file);
        processedImages.push(processedImage);
        setUploadProgress(((i + 1) / totalFiles) * 100);
      }

      onImagesProcessed(processedImages);
    } catch (error) {
      console.error('Background removal error:', error);
      alert('Error removing background. Please try again.');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  }, [onImagesProcessed, setIsProcessing]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.tiff', '.webp'],
    },
    multiple: true,
    disabled: isProcessing,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-16 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-black bg-gray-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'cursor-not-allowed opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-6">
          {isProcessing ? (
            <>
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto text-lg">
                🤖
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">
                  AI is removing backgrounds...
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {qualityMode === 'quality' ? '🎯 Quality Mode - Better results' : '⚡ Fast Mode - Quick processing'}
                </p>
                <div className="w-full max-w-md mx-auto">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-black h-2 rounded-full transition-all duration-500"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {Math.round(uploadProgress)}% Complete
                  </p>
                </div>
              </div>
            </>
          ) : isDragActive ? (
            <>
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto text-lg">
                📤
              </div>
              <div>
                <h3 className="text-xl font-medium text-black">
                  Drop your images here
                </h3>
                <p className="text-gray-600">
                  Release to start removing backgrounds
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto text-lg">
                ✂️
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">
                  Drop images here or click to browse
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload photos to remove backgrounds instantly using AI
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Portraits
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Products
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Objects
                  </span>
                </div>
                
                {/* Quality Mode Selector */}
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setQualityMode('fast')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      qualityMode === 'fast' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ⚡ Fast Mode
                  </button>
                  <button
                    onClick={() => setQualityMode('quality')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      qualityMode === 'quality' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🎯 Quality Mode
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {!isProcessing && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Max file size: 50MB per image • Supported formats: JPG, PNG, GIF, BMP, TIFF, WebP
          </p>
        </div>
      )}
    </div>
  );
} 