import React from 'react';
import { Leaf } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Leaf className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            NutriSnap AI
          </h1>
        </div>
        <nav>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            About
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;