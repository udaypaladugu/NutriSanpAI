import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { AppState } from '../types';

interface UploadSectionProps {
  onImageSelect: (file: File) => void;
  state: AppState;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onImageSelect, state }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (state === AppState.ANALYZING) return;
    onImageSelect(file);
  };

  const isLoading = state === AppState.ANALYZING;

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div
        className={`relative group rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
          ${dragActive ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-slate-50'}
          ${isLoading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
        
        <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
          <div className={`p-4 rounded-full transition-colors duration-300 ${dragActive ? 'bg-emerald-200' : 'bg-slate-100 group-hover:bg-emerald-100'}`}>
            {isLoading ? (
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            ) : (
              <Camera className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-700">
              {isLoading ? 'Analyzing Meal...' : 'Capture or Upload Meal'}
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Tap to take a photo or drag and drop an image here to get instant nutritional details.
            </p>
          </div>

          {!isLoading && (
             <div className="flex items-center gap-4 text-xs font-medium text-slate-400 pt-2">
               <span className="flex items-center"><ImageIcon className="w-3 h-3 mr-1"/> JPG, PNG</span>
               <span className="flex items-center"><Upload className="w-3 h-3 mr-1"/> Up to 10MB</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadSection;