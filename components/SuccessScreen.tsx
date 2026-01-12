
import React from 'react';

interface Props {
  trackingNumber: string;
}

export const SuccessScreen: React.FC<Props> = ({ trackingNumber }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-200">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
        ✓
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Application Submitted!</h2>
      <p className="text-slate-500 mb-8">Thank you for applying to AA Maritime & Offshore Institute. Your application is now being processed.</p>
      
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 inline-block w-full">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Application Tracking Number</p>
        <div className="text-2xl md:text-3xl font-mono font-black text-blue-600 tracking-tight">
          {trackingNumber}
        </div>
      </div>
      
      <div className="mt-8 space-y-4 text-sm text-slate-600">
        <p>A confirmation email has been sent to your registered address.</p>
        <p>Please keep this tracking number for future reference.</p>
      </div>

      <div className="mt-12 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
        >Submit Another</button>
        <a 
          href="https://aamoi.edu"
          className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
        >Back to Website</a>
      </div>
    </div>
  );
};
