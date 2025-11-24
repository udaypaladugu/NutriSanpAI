import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { AppState } from '../types';

interface UploadSectionProps {
  onImageSelect: (file: File) => void;
  state: AppState;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onImageSelect, state }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Handle Camera Stream Lifecycle
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isCameraOpen) {
      const startCamera = async () => {
        try {
          setCameraError(null);
          // Request camera with preference for the rear camera (environment)
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera access error:", err);
          setCameraError("Unable to access camera. Please check permissions or use the file upload option.");
        }
      };
      startCamera();
    }

    return () => {
      // Cleanup: Stop all tracks when component unmounts or camera closes
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match the video stream's intrinsic resolution
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw the current video frame to the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob, then to File
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured_meal.jpg", { type: "image/jpeg" });
            onImageSelect(file);
            setIsCameraOpen(false);
          }
        }, 'image/jpeg', 0.85);
      }
    }
  };

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

  // Render Camera Interface
  if (isCameraOpen) {
    return (
        <div className="w-full max-w-xl mx-auto mb-8 animate-in fade-in zoom-in duration-300">
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-[3/4] md:aspect-[4/3] shadow-lg ring-1 ring-slate-900/10">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Camera Controls Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-between">
                     <button 
                        onClick={() => setIsCameraOpen(false)}
                        className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"
                        title="Close Camera"
                     >
                        <X className="w-6 h-6" />
                     </button>
                     
                     <button 
                        onClick={handleCapture}
                        className="p-1 rounded-full border-4 border-white/80 hover:border-white transition-all hover:scale-105 active:scale-95"
                        title="Capture Photo"
                     >
                        <div className="w-16 h-16 bg-white rounded-full shadow-inner" />
                     </button>
                     
                     <div className="w-12" /> {/* Spacer for layout balance */}
                </div>
                
                {cameraError && (
                    <div className="absolute inset-0 bg-slate-900/90 z-10 flex flex-col items-center justify-center text-white p-6 text-center">
                        <p className="mb-4 text-red-300 font-medium">{cameraError}</p>
                        <button 
                          onClick={() => setIsCameraOpen(false)} 
                          className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          Close Camera
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
  }

  // Render Upload Interface
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div
        className={`relative group rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
          ${dragActive ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-slate-50'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
        
        <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-6">
          
          {/* Icon */}
          <div className={`p-4 rounded-full transition-colors duration-300 ${dragActive ? 'bg-emerald-200' : 'bg-slate-100 group-hover:bg-emerald-100'}`}>
            {isLoading ? (
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            )}
          </div>
          
          {/* Instructions */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-700">
              {isLoading ? 'Analyzing Meal...' : 'Add a Meal Photo'}
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Take a photo instantly or upload from your gallery.
            </p>
          </div>

          {/* Action Buttons */}
          {!isLoading && (
             <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
               <button
                 onClick={(e) => {
                   e.preventDefault(); // Stop default to prevent any bubbling issues
                   setIsCameraOpen(true);
                 }}
                 className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-500 transition-all shadow-sm hover:shadow flex items-center justify-center"
               >
                 <Camera className="w-4 h-4 mr-2" />
                 Take Photo
               </button>

               <button
                 onClick={() => fileInputRef.current?.click()}
                 className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center"
               >
                 <ImageIcon className="w-4 h-4 mr-2" />
                 Upload File
               </button>
             </div>
          )}

          {/* Footer Info */}
          {!isLoading && (
             <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
               <span>JPG, PNG, WEBP</span>
               <span className="w-1 h-1 rounded-full bg-slate-300"></span>
               <span>Max 10MB</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadSection;