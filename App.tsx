import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ResultsSection from './components/ResultsSection';
import { analyzeImage } from './services/geminiService';
import { NutritionData, AppState } from './types';
import { AlertOctagon } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    try {
      // 1. Show image preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // 2. Start Analysis
      setState(AppState.ANALYZING);
      setErrorMessage(null);
      
      const data = await analyzeImage(file);
      
      setNutritionData(data);
      setState(AppState.SUCCESS);
    } catch (error: any) {
      console.error("Error analyzing image:", error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      setState(AppState.ERROR);
    }
  }, []);

  const handleReset = useCallback(() => {
    setState(AppState.IDLE);
    setNutritionData(null);
    setImageSrc(null);
    setErrorMessage(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Intro Text (Only show when idle) */}
        {state === AppState.IDLE && (
          <div className="text-center mb-10 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Know what you eat, <br />
              <span className="text-emerald-600">instantly.</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Snap a photo of your meal and let AI break down the macros, calories, and nutrients for you.
            </p>
          </div>
        )}

        {/* Upload Section (Hidden if success to declutter, visible during loading/idle) */}
        {state !== AppState.SUCCESS && (
          <UploadSection onImageSelect={handleImageSelect} state={state} />
        )}

        {/* Error Message */}
        {state === AppState.ERROR && errorMessage && (
          <div className="max-w-xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-3">
             <AlertOctagon className="w-5 h-5 flex-shrink-0" />
             <span>{errorMessage}</span>
             <button onClick={handleReset} className="ml-auto text-sm font-semibold underline">Retry</button>
          </div>
        )}

        {/* Results */}
        {state === AppState.SUCCESS && nutritionData && (
          <ResultsSection 
            data={nutritionData} 
            imageSrc={imageSrc} 
            reset={handleReset} 
          />
        )}

      </main>
    </div>
  );
};

export default App;