"use client";

import { useRef, useState, useEffect } from 'react';

interface ImageTouchupProps {
  originalImageUrl: string;
  processedImageUrl: string;
  onSave: (editedImageUrl: string) => void;
  onCancel: () => void;
}

export default function ImageTouchup({ 
  originalImageUrl, 
  processedImageUrl, 
  onSave, 
  onCancel 
}: ImageTouchupProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'erase' | 'restore'>('erase');
  const [brushSize, setBrushSize] = useState(20);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    loadImage();
  }, [processedImageUrl]);

  const loadImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = processedImageUrl;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.globalCompositeOperation = tool === 'erase' ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
    
    if (tool === 'restore') {
      // For restore, we need to draw from the original image
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; // Placeholder - would need original image data
    }
    
    ctx.fill();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        onSave(url);
      }
    }, 'image/png');
  };

  const resetCanvas = () => {
    loadImage();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-black mb-4">Touch Up Image</h3>
          
          {/* Tools */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setTool('erase')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  tool === 'erase' 
                    ? 'bg-red-100 text-red-700 border border-red-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🗑️ Erase
              </button>
              <button
                onClick={() => setTool('restore')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  tool === 'restore' 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ✏️ Restore
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Brush Size:</label>
              <input
                type="range"
                min="5"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600 w-8">{brushSize}</span>
            </div>
            
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {showOriginal ? '👁️ Hide Original' : '👁️ Show Original'}
            </button>
            
            <button
              onClick={resetCanvas}
              className="px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              🔄 Reset
            </button>
          </div>
        </div>
        
        {/* Canvas Area */}
        <div className="p-4 max-h-[60vh] overflow-auto">
          <div className="relative inline-block">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="border border-gray-300 cursor-crosshair max-w-full h-auto"
              style={{ 
                background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            />
            
            {showOriginal && (
              <img
                src={originalImageUrl}
                alt="Original"
                className="absolute top-0 left-0 opacity-50 pointer-events-none max-w-full h-auto"
              />
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md text-sm font-medium bg-black text-white hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 