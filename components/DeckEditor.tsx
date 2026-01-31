
import React, { useState } from 'react';
import { Deck, Card, COLORS } from '../types';

interface DeckEditorProps {
  deck?: Deck;
  onSave: (deck: Deck) => Promise<void> | void;
  onCancel: () => void;
}

const DeckEditor: React.FC<DeckEditorProps> = ({ deck, onSave, onCancel }) => {
  const [title, setTitle] = useState(deck?.title || '');
  const [description, setDescription] = useState(deck?.description || '');
  const [color, setColor] = useState(deck?.color || COLORS[0]);
  const [cards, setCards] = useState<Card[]>(deck?.cards || []);
  

  const addCard = () => {
    setCards([...cards, { id: crypto.randomUUID(), front: '', back: '' }]);
  };

  const updateCard = (id: string, field: 'front' | 'back', value: string) => {
    setCards(cards.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  

  const handleSave = () => {
    if (!title.trim()) {
      alert("Name your masterpiece first!");
      return;
    }
    onSave({
      id: deck?.id || crypto.randomUUID(),
      title,
      description,
      color,
      cards,
      createdAt: deck?.createdAt || Date.now()
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-5xl font-fredoka font-bold text-white mb-2">
            {deck ? 'Edit Deck' : 'Construct Deck'}
          </h2>
          <p className="text-slate-500 font-medium">Design your learning flow.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="px-8 py-3 glass rounded-2xl text-slate-300 font-bold hover:bg-white/10 transition-all"
          >
            DISCARD
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-900/40 hover:bg-indigo-500 transition-all neo-shadow active:translate-y-1 active:shadow-none"
          >
            SAVE MISSION
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/5 space-y-8 shadow-2xl">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Deck Identity</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Physics Quantum 101"
                className="w-full text-2xl p-6 bg-slate-950 border-2 border-slate-800 focus:border-indigo-500 rounded-[1.5rem] outline-none transition-all text-white font-bold placeholder:text-slate-800 shadow-inner"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Briefing (Description)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are we mastering today?"
                className="w-full p-6 bg-slate-950 border-2 border-slate-800 focus:border-indigo-500 rounded-[1.5rem] outline-none transition-all text-white min-h-[120px] resize-none placeholder:text-slate-800 shadow-inner"
              />
            </div>
          </div>

          <div className="bg-indigo-600/10 rounded-[2.5rem] p-10 border-2 border-indigo-500/20 flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-2">Card Tools</h3>
              <p className="text-slate-400 max-w-sm">Create and edit cards manually. Decks are stored on your backend server.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Aesthetic Palette</label>
            <div className="grid grid-cols-4 gap-3">
              {COLORS.map(c => (
                <button 
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-full aspect-square rounded-2xl transition-all ${c} ${color === c ? 'ring-[6px] ring-white scale-110' : 'opacity-40 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>

          <div className="bg-slate-950/50 rounded-[2.5rem] p-8 border border-white/5 space-y-4">
             <div className="flex items-center justify-between mb-2">
               <h4 className="text-xl font-bold text-white">Cards</h4>
               <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">{cards.length}</span>
             </div>
             <p className="text-slate-500 text-xs">Total brain chunks stored in this deck.</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between mt-12">
          <h3 className="text-3xl font-fredoka font-bold text-white">Deck Contents</h3>
          <button 
            onClick={addCard}
            className="group flex items-center gap-3 bg-white text-slate-950 px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-400 hover:text-white transition-all neo-shadow active:translate-y-1 active:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            ADD CARD
          </button>
        </div>

        <div className="grid gap-6">
          {cards.map((card, idx) => (
            <div key={card.id} className="group bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row gap-8 items-start hover:border-indigo-500/30 transition-colors shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center text-sm font-black shrink-0 shadow-inner group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                {idx + 1}
              </div>
              <div className="flex-1 grid md:grid-cols-2 gap-8 w-full">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Front Face (Prompt)</label>
                   <textarea 
                    value={card.front}
                    onChange={(e) => updateCard(card.id, 'front', e.target.value)}
                    placeholder="Ask something..."
                    className="w-full p-5 bg-slate-950 border-2 border-slate-800 rounded-2xl outline-none focus:border-indigo-500 text-white transition-all resize-none h-28 placeholder:text-slate-800"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Back Face (Payload)</label>
                   <textarea 
                    value={card.back}
                    onChange={(e) => updateCard(card.id, 'back', e.target.value)}
                    placeholder="The raw facts..."
                    className="w-full p-5 bg-slate-950 border-2 border-slate-800 rounded-2xl outline-none focus:border-indigo-500 text-white transition-all resize-none h-28 placeholder:text-slate-800"
                   />
                </div>
              </div>
              <button 
                onClick={() => removeCard(card.id)}
                className="mt-2 text-slate-700 hover:text-rose-500 p-3 transition-colors bg-white/5 rounded-2xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeckEditor;
