
import React, { useState } from 'react';
import { Drink } from '../types';
import CommandBoard from './CommandBoard';
import InventoryStatus from './InventoryStatus';
import Header from './Header';
import AddStockModal from './AddStockModal';
import { PlusIcon, BeverageIcon } from './IconComponents';

interface DrinksWorkspaceProps {
    drinks: Drink[];
    onUpdateQuantity: (drinkId: string, amount: number) => void;
    onAddOrUpdateDrink: (newDrinkData: Omit<Drink, 'id'>) => void;
    onDeleteDrink: (drinkId: string) => void;
    onReorder: (reorderedDrinks: Drink[]) => void;
}

const DrinksWorkspace: React.FC<DrinksWorkspaceProps> = ({
    drinks,
    onUpdateQuantity,
    onAddOrUpdateDrink,
    onDeleteDrink,
    onReorder
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleSaveDrink = (newDrinkData: Omit<Drink, 'id'>) => {
    onAddOrUpdateDrink(newDrinkData);
    setIsModalOpen(false);
  };

  return (
    <>
      <Header title="Inventar Pića" icon={<BeverageIcon className="w-8 h-8 text-brand-primary" />} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
             <CommandBoard drinks={drinks} onUpdateQuantity={onUpdateQuantity} onReorder={onReorder} />
          </div>
          <div>
            <InventoryStatus drinks={drinks} onDeleteDrink={onDeleteDrink} />
             <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-brand-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-opacity-50"
            >
                <PlusIcon className="w-6 h-6" />
                Dodaj/Ažuriraj Zalihe
            </button>
          </div>
        </div>
      </main>
      <AddStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDrink}
      />
    </>
  );
};

export default DrinksWorkspace;
