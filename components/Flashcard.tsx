
import React from 'react';

interface FlashcardProps {
  front: string;
  back: string;
  color: string;
  isFlipped: boolean;
  onFlip: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ front, back, color, isFlipped, onFlip }) => {
  return (
    <div 
      className="relative w-full h-[400px] perspective-1000 cursor-pointer select-none group"
      onClick={onFlip}
    >
      <div 
        className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front */}
        <div className={`absolute inset-0 backface-hidden flex items-center justify-center p-10 rounded-[2.5rem] border-[6px] border-slate-900 ${color} neo-shadow transition-transform group-hover:scale-[1.02]`}>
          <div className="flex flex-col items-center gap-6">
            <div className="px-4 py-1 bg-black/20 rounded-full text-xs font-black uppercase tracking-[0.2em] text-white/90">
              The Question
            </div>
            <h3 className="text-3xl md:text-4xl font-fredoka font-bold text-white text-center leading-tight drop-shadow-lg">
              {front || "Type a question..."}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-white/60 text-sm font-bold animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
              TAP TO FLIP
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center p-10 rounded-[2.5rem] border-[6px] border-indigo-500 bg-slate-900 text-white shadow-2xl">
           <div className="flex flex-col items-center gap-6">
            <div className="px-4 py-1 bg-indigo-500/20 rounded-full text-xs font-black uppercase tracking-[0.2em] text-indigo-400">
              The Answer
            </div>
            <p className="text-2xl md:text-3xl font-medium text-slate-100 text-center leading-relaxed">
              {back || "..."}
            </p>
            <div className="absolute top-6 left-6 opacity-10">
               <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
