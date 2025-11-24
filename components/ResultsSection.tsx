import React from 'react';
import { NutritionData } from '../types';
import NutritionCharts from './NutritionCharts';
import { AlertCircle, Flame, Droplet, Wheat, Beef } from 'lucide-react';

interface ResultsSectionProps {
  data: NutritionData;
  imageSrc: string | null;
  reset: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ data, imageSrc, reset }) => {
  if (!data.isFood) {
    return (
      <div className="w-full max-w-xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <h3 className="text-lg font-semibold text-red-700">Not Food Detected</h3>
        <p className="text-red-600 text-sm">
          We couldn't identify any food in this image. Please try uploading a clear photo of a meal.
        </p>
        <button 
          onClick={reset}
          className="mt-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const MacroCard = ({ label, value, unit, icon: Icon, colorClass, bgClass }: any) => (
    <div className={`${bgClass} rounded-xl p-4 flex flex-col items-center justify-center space-y-1`}>
      <Icon className={`w-5 h-5 ${colorClass} mb-1`} />
      <span className="text-2xl font-bold text-slate-800">{value}</span>
      <span className="text-xs font-medium text-slate-500 uppercase">{label} ({unit})</span>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Image & Summary */}
        <div className="space-y-6">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
             {imageSrc && (
              <img 
                src={imageSrc} 
                alt="Analyzed Meal" 
                className="w-full h-64 object-cover rounded-xl"
              />
            )}
            <div className="mt-4 px-2">
              <h2 className="text-2xl font-bold text-slate-800">{data.foodName}</h2>
              <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                {data.description}
              </p>
            </div>
          </div>
          
          <button 
            onClick={reset}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors shadow-sm"
          >
            Analyze Another Meal
          </button>
        </div>

        {/* Right Column: Stats & Charts */}
        <div className="space-y-6">
          {/* Main Calorie Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-700">Nutritional Breakdown</h3>
              <div className="flex items-center space-x-1 text-orange-500 font-bold">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{data.calories} kcal</span>
              </div>
            </div>
            
            <div className="p-6">
              <NutritionCharts data={data} />
            </div>
          </div>

          {/* Macros Grid */}
          <div className="grid grid-cols-3 gap-4">
            <MacroCard 
              label="Protein" 
              value={data.protein} 
              unit="g" 
              icon={Beef} 
              colorClass="text-emerald-500" 
              bgClass="bg-emerald-50" 
            />
            <MacroCard 
              label="Carbs" 
              value={data.carbs} 
              unit="g" 
              icon={Wheat} 
              colorClass="text-blue-500" 
              bgClass="bg-blue-50" 
            />
            <MacroCard 
              label="Fat" 
              value={data.fat} 
              unit="g" 
              icon={Droplet} 
              colorClass="text-amber-500" 
              bgClass="bg-amber-50" 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsSection;