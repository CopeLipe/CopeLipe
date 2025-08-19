import React, { useState, useMemo, useRef, useEffect } from 'react';
import Header from './Header';
import { FoodIcon, PlusIcon, UserPlusIcon, TrashIcon, ChevronDownIcon, MagnifyingGlassIcon, CreditCardIcon } from './IconComponents';
import { Drink, Guest } from '../types';

interface FoodWorkspaceProps {
    drinks: Drink[];
    guests: Guest[];
    onAddGuest: (name: string) => void;
    onDeleteGuest: (guestId: string) => void;
    onAddDrinkToGuest: (guestId: string, drinkId: string) => void;
    onGuestPaid: (guestId: string) => void;
}

const AddGuestForm: React.FC<{ onAddGuest: (name: string) => void }> = ({ onAddGuest }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddGuest(name);
        setName('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-3 items-stretch p-4 bg-white/70 backdrop-blur-md rounded-xl shadow-md">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Unesite ime gosta..."
                className="flex-grow px-4 py-2 border border-slate-300 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-secondary bg-white/50 focus:bg-white placeholder:text-slate-500 focus:placeholder:text-slate-400"
                required
            />
            <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-2 px-5 rounded-lg shadow-sm hover:bg-brand-dark transition-colors"
            >
                <UserPlusIcon className="w-5 h-5" />
                <span>Dodaj gosta</span>
            </button>
        </form>
    );
};

const AddDrinkPopover: React.FC<{
    drinks: Drink[];
    onAddDrink: (drinkId: string) => void;
    onClose: () => void;
}> = ({ drinks, onAddDrink, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const availableDrinks = drinks.filter(d => d.quantity > 0 && d.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div ref={popoverRef} className="absolute bottom-full mb-2 w-72 bg-white/80 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 z-10 right-0">
            <div className="p-3 border-b border-slate-200">
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Pretraži piće..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/50 border border-slate-300 rounded-md pl-10 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                    />
                </div>
            </div>
            <div className="max-h-60 overflow-y-auto p-2">
                {availableDrinks.length > 0 ? availableDrinks.map(drink => (
                    <button
                        key={drink.id}
                        onClick={() => {
                            onAddDrink(drink.id);
                            onClose();
                        }}
                        className="w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-brand-light hover:text-brand-dark transition-colors text-sm"
                    >
                        <span className="text-xl">{drink.emoji}</span>
                        <span>{drink.name}</span>
                        <span className="ml-auto text-xs text-slate-500">({drink.quantity} kom)</span>
                    </button>
                )) : <p className="text-center text-sm text-slate-500 p-4">Nema rezultata.</p>}
            </div>
        </div>
    );
};

const PaymentConfirmationModal: React.FC<{
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity" onClick={onCancel}>
            <div
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm m-4 text-center transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-4xl font-extrabold text-slate-800 mb-6">Finnito?</h2>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        className="px-8 py-3 bg-switch-right text-white font-bold text-lg rounded-lg shadow-md hover:opacity-90 transition-opacity"
                    >
                        NE
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-8 py-3 bg-switch-left text-white font-bold text-lg rounded-lg shadow-md hover:opacity-90 transition-opacity"
                    >
                        DA
                    </button>
                </div>
            </div>
        </div>
    );
};


const GuestCard: React.FC<{
    guest: Guest;
    drinks: Drink[];
    onDelete: (id: string) => void;
    onAddDrink: (guestId: string, drinkId: string) => void;
    onGuestPaid: (guestId: string) => void;
}> = ({ guest, drinks, onDelete, onAddDrink, onGuestPaid }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    
    const totalBill = useMemo(() => {
        return guest.orders.reduce((total, order) => total + order.quantity * order.pricePerItem, 0);
    }, [guest.orders]);

    return (
        <>
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg flex flex-col transition-all duration-300">
                {/* Header */}
                <div 
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/30 rounded-t-2xl"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <h3 className="text-lg font-bold text-slate-800">{guest.name}</h3>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-primary text-lg">{totalBill.toFixed(2)} RSD</span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(guest.id); }} 
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            aria-label={`Obriši gosta ${guest.name}`}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                        <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                {/* Collapsible Content */}
                <div className={`transition-all duration-300 ease-in-out grid ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className={isPopoverOpen ? 'overflow-visible' : 'overflow-hidden'}>
                        <div className="p-4 border-t border-slate-300/50">
                            {guest.orders.length === 0 ? (
                                <p className="text-slate-500 text-center py-4">Nema narudžbina.</p>
                            ) : (
                                <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                    {guest.orders.map(order => (
                                        <li key={order.drinkId} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-700">{order.name} x{order.quantity}</span>
                                            <span className="font-semibold text-slate-600">{(order.quantity * order.pricePerItem).toFixed(2)} RSD</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-300/50 relative flex gap-3">
                            <button
                                onClick={() => setIsPopoverOpen(true)}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Dodaj Piće
                            </button>
                             <button
                                onClick={() => setIsConfirmModalOpen(true)}
                                className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 font-bold py-2 px-4 rounded-lg hover:bg-green-200 transition-colors"
                            >
                                <CreditCardIcon className="w-5 h-5" />
                                Naplati
                            </button>
                            {isPopoverOpen && (
                                <AddDrinkPopover
                                    drinks={drinks}
                                    onClose={() => setIsPopoverOpen(false)}
                                    onAddDrink={(drinkId) => onAddDrink(guest.id, drinkId)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <PaymentConfirmationModal
                isOpen={isConfirmModalOpen}
                onConfirm={() => {
                    onGuestPaid(guest.id);
                    setIsConfirmModalOpen(false);
                }}
                onCancel={() => setIsConfirmModalOpen(false)}
            />
        </>
    );
};

const FoodWorkspace: React.FC<FoodWorkspaceProps> = ({ drinks, guests, onAddGuest, onDeleteGuest, onAddDrinkToGuest, onGuestPaid }) => {
  return (
    <>
      <Header title="Uslugica - Računi Gostiju" icon={<FoodIcon className="w-8 h-8 text-brand-primary" />} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <AddGuestForm onAddGuest={onAddGuest} />

        {guests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {guests.map(guest => (
                    <GuestCard 
                        key={guest.id} 
                        guest={guest} 
                        drinks={drinks} 
                        onDelete={onDeleteGuest} 
                        onAddDrink={onAddDrinkToGuest} 
                        onGuestPaid={onGuestPaid}
                    />
                ))}
            </div>
        ) : (
             <div className="text-center py-20 text-slate-500 bg-white/70 backdrop-blur-md rounded-xl shadow-md">
                <p className="text-lg">Nema aktivnih gostiju.</p>
                <p className="text-sm mt-2">Upotrebite formu iznad da dodate prvog gosta.</p>
            </div>
        )}
      </main>
    </>
  );
};

export default FoodWorkspace;