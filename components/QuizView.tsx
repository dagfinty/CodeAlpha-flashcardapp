
import React, { useState, useEffect, useRef } from 'react';
import { Deck } from '../types';
import Flashcard from './Flashcard';

interface QuizViewProps {
  deck: Deck;
  onExit: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ deck, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);
  
  // Fix: Use ReturnType<typeof setInterval> instead of NodeJS.Timeout to avoid namespace errors in browser environments
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isTimerActive && !isComplete && !isFlipped) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Fix: Added safety check before clearing interval
            if (timerRef.current) clearInterval(timerRef.current);
            setIsFlipped(true); // Auto flip when time's up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isTimerActive, isComplete, isFlipped]);

  const currentCard = deck.cards[currentIndex];
  const progress = ((currentIndex) / deck.cards.length) * 100;

  const handleNext = (known: boolean) => {
    if (known) {
      setScore(s => ({ ...s, correct: s.correct + 1 }));
    } else {
      setScore(s => ({ ...s, incorrect: s.incorrect + 1 }));
    }

    if (currentIndex < deck.cards.length - 1) {
      setIsFlipped(false);
      setTimeLeft(15);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 300);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    const accuracy = Math.round((score.correct / deck.cards.length) * 100);
    return (
      <div className="max-w-xl mx-auto py-12 px-6 text-center space-y-10 animate-in fade-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-indigo-600 rounded-[2rem] neo-shadow flex items-center justify-center mx-auto rotate-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
          </div>
        </div>
        
        <div>
          <h2 className="text-5xl font-fredoka font-bold text-white mb-2">Epic Session!</h2>
          <p className="text-slate-400 text-xl">You just leveled up your brain on "{deck.title}"</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 neo-shadow-sm">
             <div className="text-3xl font-black text-emerald-400">{score.correct}</div>
             <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mt-1">Learned</div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 neo-shadow-sm">
             <div className="text-3xl font-black text-rose-500">{score.incorrect}</div>
             <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mt-1">Review</div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 neo-shadow-sm">
             <div className="text-3xl font-black text-indigo-400">{accuracy}%</div>
             <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mt-1">Accuracy</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onExit}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all neo-shadow active:translate-y-1 active:shadow-none"
          >
            CONTINUE MISSION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-10">
      {/* HUD Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onExit}
          className="w-12 h-12 glass hover:bg-white/10 rounded-2xl flex items-center justify-center text-slate-400 transition-all border border-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <div className="flex flex-col items-center">
          <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">{deck.title}</h4>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-fredoka font-bold text-white">{currentIndex + 1}</span>
            <div className="h-6 w-[2px] bg-slate-800" />
            <span className="text-2xl font-fredoka font-bold text-slate-600">{deck.cards.length}</span>
          </div>
        </div>

        <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-colors ${timeLeft < 5 ? 'border-rose-500 text-rose-500 animate-pulse' : 'border-indigo-500/30 text-indigo-400'}`}>
           <span className="text-xl font-black font-fredoka">{timeLeft}</span>
        </div>
      </div>

      {/* Modern Progress Track */}
      <div className="h-4 w-full bg-slate-900 rounded-full border border-slate-800 overflow-hidden p-1 shadow-inner">
        <div 
          className="h-full bg-indigo-500 rounded-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute top-0 right-0 w-8 h-full bg-white/30 blur-sm" />
        </div>
      </div>

      {/* Card Arena */}
      <div className="relative">
        <Flashcard 
          front={currentCard.front} 
          back={currentCard.back} 
          color={deck.color} 
          isFlipped={isFlipped}
          onFlip={() => {
            setIsFlipped(!isFlipped);
            if (!isFlipped && timerRef.current) clearInterval(timerRef.current);
          }}
        />
      </div>

      {/* Battle Controls */}
      <div className={`grid grid-cols-2 gap-6 transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0 scale-100' : 'opacity-30 pointer-events-none translate-y-4 scale-95'}`}>
        <button 
          onClick={() => handleNext(false)}
          className="group flex flex-col items-center gap-3 p-8 rounded-[2.5rem] bg-slate-900/50 border-[3px] border-rose-500/20 hover:border-rose-500/60 hover:bg-rose-500/5 transition-all active:scale-95"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-900/40 group-hover:rotate-12 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </div>
          <span className="font-black text-rose-500 text-sm tracking-widest uppercase">NOT YET</span>
        </button>
        <button 
          onClick={() => handleNext(true)}
          className="group flex flex-col items-center gap-3 p-8 rounded-[2.5rem] bg-slate-900/50 border-[3px] border-emerald-500/20 hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-all active:scale-95"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover:-rotate-12 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <span className="font-black text-emerald-500 text-sm tracking-widest uppercase">GOT IT!</span>
        </button>
      </div>
    </div>
  );
};

export default QuizView;
