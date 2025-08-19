import React, { useState } from 'react';
import { Drink } from '../types';
import { MinusIcon, PlusIcon } from './IconComponents';

interface CommandBoardProps {
  drinks: Drink[];
  onUpdateQuantity: (drinkId: string, amount: number) => void;
  onReorder: (reorderedDrinks: Drink[]) => void;
}

const CommandBoard: React.FC<CommandBoardProps> = ({ drinks, onUpdateQuantity, onReorder }) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    if (draggedItemId && draggedItemId !== id) {
      setDragOverItemId(id);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverItemId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (!draggedItemId || draggedItemId === targetId) {
      setDraggedItemId(null);
      setDragOverItemId(null);
      return;
    }

    const draggedIndex = drinks.findIndex(d => d.id === draggedItemId);
    const targetIndex = drinks.findIndex(d => d.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
        setDraggedItemId(null);
        setDragOverItemId(null);
        return;
    };

    const reorderedDrinks = [...drinks];
    const [draggedItem] = reorderedDrinks.splice(draggedIndex, 1);
    reorderedDrinks.splice(targetIndex, 0, draggedItem);
    
    onReorder(reorderedDrinks);
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-slate-700 border-b border-slate-300/50 pb-3">Komandna Tabla</h2>
      {drinks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {drinks.map(drink => {
            const isBeingDragged = draggedItemId === drink.id;
            const isDragTarget = dragOverItemId === drink.id;
            return (
              <div
                key={drink.id}
                draggable
                onDragStart={(e) => handleDragStart(e, drink.id)}
                onDragEnter={(e) => handleDragEnter(e, drink.id)}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, drink.id)}
                onDragEnd={handleDragEnd}
                className={`relative flex flex-col items-center justify-center p-4 bg-white/50 border rounded-lg shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing 
                  ${isBeingDragged ? 'opacity-30 border-dashed border-slate-400' : 'border-slate-200 hover:shadow-md hover:border-brand-secondary'}
                  ${isDragTarget ? 'ring-2 ring-brand-secondary ring-offset-2' : ''}
                `}
              >
                <div className="text-4xl mb-2 select-none">{drink.emoji}</div>
                <p className="font-semibold text-center text-slate-700 select-none">{drink.name}</p>
                 <p className="text-sm font-semibold text-brand-primary select-none mt-1">{drink.price} RSD</p>
                <p className={`text-2xl font-bold select-none ${drink.quantity > 0 ? 'text-slate-900' : 'text-red-500'}`}>
                  {drink.quantity}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => onUpdateQuantity(drink.id, -1)}
                    disabled={drink.quantity === 0}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                    aria-label={`Smanji količinu za ${drink.name}`}
                  >
                    <MinusIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onUpdateQuantity(drink.id, 1)}
                    className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    aria-label={`Povećaj količinu za ${drink.name}`}
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 text-slate-500">
          <p>Nema pića u inventaru.</p>
          <p className="text-sm mt-2">Kliknite na "Dodaj/Ažuriraj Zalihe" da biste započeli.</p>
        </div>
      )}
    </div>
  );
};

export default CommandBoard;