
import React, { useState, useEffect } from 'react';
import { Deck, View } from './types';
import { loadDecks, saveDecks } from './services/storage';
import DeckEditor from './components/DeckEditor';
import QuizView from './components/QuizView';

const App: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const d = await loadDecks();
      setDecks(d);
    })();
  }, []);

  const handleSaveDeck = async (newDeck: Deck) => {
    const exists = decks.find(d => d.id === newDeck.id);
    const updatedDecks = exists 
      ? decks.map(d => d.id === newDeck.id ? newDeck : d)
      : [newDeck, ...decks];
    
    setDecks(updatedDecks);
    await saveDecks(updatedDecks);
    setCurrentView('HOME');
    setSelectedDeckId(null);
  };

  const handleDeleteDeck = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Burn this deck? This will delete all cards forever.")) {
      const updated = decks.filter(d => d.id !== id);
      setDecks(updated);
      await saveDecks(updated);
    }
  };

  const startEdit = (deck: Deck) => {
    setSelectedDeckId(deck.id);
    setCurrentView('EDIT');
  };

  const startQuiz = (deck: Deck) => {
    if (deck.cards.length === 0) {
      alert("This deck is empty! Add some juice before starting.");
      return;
    }
    setSelectedDeckId(deck.id);
    setCurrentView('QUIZ');
  };

  const currentDeck = decks.find(d => d.id === selectedDeckId);

  return (
    <div className="min-h-screen">
      {/* Dynamic Header */}
      <nav className="sticky top-0 z-50 px-6 py-6 glass border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => setCurrentView('HOME')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="w-14 h-14 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center text-white neo-shadow transition-transform group-hover:scale-110 group-hover:rotate-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-fredoka font-bold text-white tracking-tight">FlashPulse</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Neuro-Aesthetic Learning</p>
            </div>
          </div>

          {currentView === 'HOME' && (
            <button 
              onClick={() => {
                setSelectedDeckId(null);
                setCurrentView('EDIT');
              }}
              className="px-8 py-3 bg-white text-slate-950 rounded-2xl font-black text-sm hover:bg-indigo-400 hover:text-white transition-all neo-shadow active:translate-y-1 active:shadow-none"
            >
              CREATE DECK
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {currentView === 'HOME' && (
          <div className="space-y-16">
            <header className="relative max-w-2xl">
              <h2 className="text-6xl md:text-8xl font-fredoka font-bold text-white leading-none mb-4">
                Brain <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Overdrive.</span>
              </h2>
              <p className="text-slate-400 text-xl font-medium">Ready to crush your goals? Pick a deck and let's go.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {decks.map(deck => (
                <div 
                  key={deck.id}
                  onClick={() => startQuiz(deck)}
                  className="group relative bg-slate-900 rounded-[3rem] p-1 shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden border border-white/5"
                >
                  <div className={`absolute top-0 right-0 w-40 h-40 ${deck.color} opacity-20 rounded-bl-[6rem] group-hover:scale-150 transition-transform duration-700`} />
                  
                  <div className="relative p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className={`w-16 h-16 ${deck.color} rounded-[1.5rem] flex items-center justify-center text-white neo-shadow-sm`}>
                         <span className="font-black text-2xl drop-shadow-md">{deck.title.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="px-4 py-1 glass rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {deck.cards.length} CARDS
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{deck.title}</h3>
                      <p className="text-slate-500 text-sm line-clamp-2 mt-2 leading-relaxed">{deck.description || 'Level up your knowledge on this topic.'}</p>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          startQuiz(deck);
                        }}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-xs text-white uppercase tracking-widest transition-colors"
                      >
                        Start Quiz
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(deck);
                        }}
                        className="p-3 bg-white/5 hover:bg-indigo-500 hover:text-white rounded-2xl text-slate-400 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                      </button>
                      <button 
                        onClick={(e) => handleDeleteDeck(deck.id, e)}
                        className="p-3 bg-white/5 hover:bg-rose-500 hover:text-white rounded-2xl text-slate-400 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {decks.length === 0 && (
                <div 
                  onClick={() => setCurrentView('EDIT')}
                  className="col-span-full py-32 glass rounded-[4rem] border-4 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-6 cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all group"
                >
                  <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-slate-700 group-hover:text-indigo-400 group-hover:neo-shadow transition-all group-hover:-rotate-6">
                     <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-fredoka font-bold text-white">Your Workspace is Empty</h3>
                    <p className="text-slate-500 text-lg">Click to start your first learning journey.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'EDIT' && (
          <div className="animate-in slide-in-from-bottom-10 duration-500">
            <DeckEditor 
              deck={currentDeck} 
              onSave={handleSaveDeck} 
              onCancel={() => setCurrentView('HOME')} 
            />
          </div>
        )}

        {currentView === 'QUIZ' && currentDeck && (
          <div className="animate-in zoom-in duration-500">
            <QuizView 
              deck={currentDeck} 
              onExit={() => setCurrentView('HOME')} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
