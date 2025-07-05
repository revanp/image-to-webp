"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { ConvertedImage } from '@/app/page';

interface ImageDropzoneProps {
  onImagesConverted: (images: ConvertedImage[]) => void;
  isConverting: boolean;
  setIsConverting: (converting: boolean) => void;
}

export default function ImageDropzone({ 
  onImagesConverted, 
  isConverting, 
  setIsConverting 
}: ImageDropzoneProps) {
  const [uploadProgress, setUploadProgress] = useState(0);

  const convertImageToWebP = async (file: File): Promise<ConvertedImage> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Conversion failed');
    }

    const blob = await response.blob();
    const webpUrl = URL.createObjectURL(blob);
    const originalUrl = URL.createObjectURL(file);

    return {
      name: file.name.replace(/\.[^/.]+$/, '.webp'),
      originalSize: file.size,
      webpSize: blob.size,
      url: webpUrl,
      originalUrl: originalUrl,
    };
  };

  const handleZipFile = async (file: File): Promise<File[]> => {
    const zip = new JSZip();
    const zipData = await zip.loadAsync(file);
    const imageFiles: File[] = [];

    for (const [filename, zipEntry] of Object.entries(zipData.files)) {
      if (!zipEntry.dir && /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(filename)) {
        const blob = await zipEntry.async('blob');
        const imageFile = new File([blob], filename, { type: blob.type });
        imageFiles.push(imageFile);
      }
    }

    return imageFiles;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsConverting(true);
    setUploadProgress(0);

    try {
      const filesToProcess: File[] = [];

      // Handle ZIP files
      for (const file of acceptedFiles) {
        if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
          const extractedFiles = await handleZipFile(file);
          filesToProcess.push(...extractedFiles);
        } else if (file.type.startsWith('image/')) {
          filesToProcess.push(file);
        }
      }

      if (filesToProcess.length === 0) {
        throw new Error('No valid image files found');
      }

      const convertedImages: ConvertedImage[] = [];
      const totalFiles = filesToProcess.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = filesToProcess[i];
        const convertedImage = await convertImageToWebP(file);
        convertedImages.push(convertedImage);
        setUploadProgress(((i + 1) / totalFiles) * 100);
      }

      onImagesConverted(convertedImages);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Error converting images. Please try again.');
    } finally {
      setIsConverting(false);
      setUploadProgress(0);
    }
  }, [onImagesConverted, setIsConverting]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.tiff', '.webp'],
      'application/zip': ['.zip'],
    },
    multiple: true,
    disabled: isConverting,
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
          ${isConverting ? 'cursor-not-allowed opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-6">
          {isConverting ? (
            <>
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto text-lg">
                ⏳
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-4">
                  Converting Images...
                </h3>
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
                  Drop your files here
                </h3>
                <p className="text-gray-600">
                  Release to start converting
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto text-lg">
                🖼️
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">
                  Drop images here or click to browse
                </h3>
                <p className="text-gray-600 mb-4">
                  Supports JPEG, PNG, GIF, BMP, TIFF, and ZIP files with images
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Single Images
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Bulk ZIP
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Multiple Files
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {!isConverting && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Max file size: 50MB per image • Supported formats: JPG, PNG, GIF, BMP, TIFF
          </p>
        </div>
      )}
    </div>
  );
} 