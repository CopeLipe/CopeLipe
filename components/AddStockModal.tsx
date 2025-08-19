import React, { useState, useEffect } from 'react';
import { Drink } from '../types';
import { CloseIcon } from './IconComponents';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (drinkData: Omit<Drink, 'id'>) => void;
}

const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [emoji, setEmoji] = useState('🥤');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setQuantity('');
      setEmoji('🥤');
      setPrice('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numQuantity = parseInt(quantity, 10);
    const numPrice = parseFloat(price);
    if (name.trim() && !isNaN(numQuantity) && numQuantity > 0 && !isNaN(numPrice) && numPrice >= 0) {
      onSave({ name: name.trim(), quantity: numQuantity, emoji, price: numPrice });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Dodaj ili Ažuriraj Zalihe</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
             <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="drink-name" className="block text-sm font-medium text-slate-600 mb-1">
                Naziv Pića
              </label>
              <input
                id="drink-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="npr. Koka-Kola, Voda, itd."
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Ako naziv već postoji, količina će biti dodata.</p>
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-600 mb-1">
                Količina za Dodavanje
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="npr. 24"
                min="1"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                required
              />
            </div>
             <div>
              <label htmlFor="emoji" className="block text-sm font-medium text-slate-600 mb-1">
                Emoji
              </label>
              <input
                id="emoji"
                type="text"
                value={emoji}
                onChange={e => setEmoji(e.target.value)}
                maxLength={2}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                required
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-600 mb-1">
                Cena (RSD)
              </label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="npr. 200"
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Cena se unosi samo za nova pića.</p>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Otkaži
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-sm hover:bg-brand-dark transition-colors"
            >
              Sačuvaj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockModal;