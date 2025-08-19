import React from 'react';
import { Drink } from '../types';
import { TrashIcon } from './IconComponents';

interface InventoryStatusProps {
  drinks: Drink[];
  onDeleteDrink: (drinkId: string) => void;
}

const DrinkRow: React.FC<{ drink: Drink; onDelete: (id: string) => void }> = ({ drink, onDelete }) => {
  let statusClasses = 'bg-slate-100/70 text-slate-600';
  let statusText = 'Na stanju';

  if (drink.quantity === 0) {
    statusClasses = 'bg-status-out text-status-out-text';
    statusText = 'Nema na stanju';
  } else if (drink.quantity <= 5) {
    statusClasses = 'bg-status-low text-status-low-text';
    statusText = 'Niske zalihe';
  }
  
  return (
    <div className="flex items-center p-3 hover:bg-white/30 rounded-md transition-colors duration-200">
      <div className="text-2xl mr-4">{drink.emoji}</div>
      <div className="flex-grow">
        <p className="font-semibold text-slate-800">{drink.name}</p>
        <div className="flex items-center gap-2 text-sm">
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusClasses}`}>{statusText}</span>
            <span className="text-slate-500">{drink.price} RSD</span>
        </div>
      </div>
      <div className="text-right">
         <p className="text-lg font-bold text-slate-900">{drink.quantity}</p>
         <p className="text-xs text-slate-500">kom</p>
      </div>
       <button 
        onClick={() => onDelete(drink.id)} 
        className="ml-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
        aria-label={`Obriši ${drink.name}`}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};


const InventoryStatus: React.FC<InventoryStatusProps> = ({ drinks, onDeleteDrink }) => {
  const sortedDrinks = [...drinks].sort((a, b) => a.quantity - b.quantity);

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg h-full">
      <h2 className="text-xl font-bold mb-4 text-slate-700 border-b border-slate-300/50 pb-3">Stanje Zaliha</h2>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
        {sortedDrinks.length > 0 ? (
          sortedDrinks.map(drink => <DrinkRow key={drink.id} drink={drink} onDelete={onDeleteDrink} />)
        ) : (
          <p className="text-center py-10 text-slate-500">Inventar je prazan.</p>
        )}
      </div>
    </div>
  );
};

export default InventoryStatus;