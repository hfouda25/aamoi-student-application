
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            AA
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-none text-lg">AAMOI</h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Student Application Portal</p>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            Official Application Form
          </span>
        </div>
      </div>
    </header>
  );
};
