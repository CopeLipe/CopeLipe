import React, { useState, useMemo } from 'react';
import Header from './Header';
import { ArchiveBoxIcon, TrashIcon, ChevronDownIcon, DocumentTextIcon, CloseIcon } from './IconComponents';
import { Guest } from '../types';

const PaidGuestCard: React.FC<{ guest: Guest }> = ({ guest }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const totalBill = useMemo(() => {
        return guest.orders.reduce((total, order) => total + order.quantity * order.pricePerItem, 0);
    }, [guest.orders]);

    const paidAtDate = useMemo(() => {
        if (!guest.paidAt) return 'N/A';
        return new Date(guest.paidAt).toLocaleString('sr-RS', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, [guest.paidAt]);

    return (
        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-md flex flex-col transition-all duration-300">
            <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/30 rounded-t-xl"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div>
                    <h3 className="text-lg font-bold text-slate-800">{guest.name}</h3>
                    <p className="text-sm text-slate-500">Plaćeno: {paidAtDate}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-bold text-brand-primary text-lg">{totalBill.toFixed(2)} RSD</span>
                     <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out grid ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                     <div className="p-4 border-t border-slate-300/50">
                        <h4 className="font-semibold text-slate-600 mb-2">Stavke računa:</h4>
                        <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {guest.orders.map((order, index) => (
                                <li key={`${order.drinkId}-${index}`} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-700">{order.name} x{order.quantity}</span>
                                    <span className="font-semibold text-slate-600">{(order.quantity * order.pricePerItem).toFixed(2)} RSD</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClearHistoryConfirmationModal: React.FC<{
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
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Potvrda Brisanja</h2>
                <p className="text-slate-600 mb-6">Da li ste sigurni da želite da obrišete celu istoriju? Ova akcija se ne može opozvati.</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        className="px-8 py-3 bg-slate-200 text-slate-800 font-bold text-lg rounded-lg shadow-md hover:bg-slate-300 transition-opacity"
                    >
                        NE
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-8 py-3 bg-red-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-red-600 transition-opacity"
                    >
                        DA
                    </button>
                </div>
            </div>
        </div>
    );
};

const SalesSummaryModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    history: Guest[];
}> = ({ isOpen, onClose, history }) => {
    const { soldItems, totalDrinksSold, totalRevenue } = useMemo(() => {
        const items: { [key: string]: { name: string; quantity: number; total: number } } = {};
        let totalDrinksSold = 0;
        let totalRevenue = 0;

        history.forEach(guest => {
            guest.orders.forEach(order => {
                totalDrinksSold += order.quantity;
                totalRevenue += order.quantity * order.pricePerItem;

                if (items[order.drinkId]) {
                    items[order.drinkId].quantity += order.quantity;
                    items[order.drinkId].total += order.quantity * order.pricePerItem;
                } else {
                    items[order.drinkId] = {
                        name: order.name,
                        quantity: order.quantity,
                        total: order.quantity * order.pricePerItem,
                    };
                }
            });
        });

        const sortedItems = Object.values(items).sort((a, b) => b.quantity - a.quantity);
        return { soldItems: sortedItems, totalDrinksSold, totalRevenue };
    }, [history]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4 transform transition-all flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 flex justify-between items-center border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <DocumentTextIcon className="w-7 h-7 text-brand-primary"/>
                        Dnevni Pazar
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                {soldItems.length > 0 ? (
                    <>
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            {soldItems.map(item => (
                                <div key={item.name} className="flex justify-between items-center p-3 bg-white/30 rounded-lg">
                                    <span className="font-semibold text-slate-700">{item.name}</span>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">{item.quantity} kom</p>
                                        <p className="text-sm text-slate-500">{item.total.toFixed(2)} RSD</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-slate-200 bg-white/20 rounded-b-2xl">
                             <div className="flex justify-between text-lg">
                                <span className="text-slate-600 font-medium">Ukupno prodatih artikala:</span>
                                <span className="font-bold text-slate-900">{totalDrinksSold}</span>
                            </div>
                            <div className="flex justify-between items-baseline mt-2">
                                <span className="text-slate-600 font-medium text-lg">Ukupan promet:</span>
                                <span className="font-extrabold text-brand-primary text-2xl">{totalRevenue.toFixed(2)} RSD</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="p-10 text-center text-slate-500">
                        <p>Nema prodatih artikala u istoriji.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


interface HistoryWorkspaceProps {
    history: Guest[];
    onClearHistory: () => void;
}

const HistoryWorkspace: React.FC<HistoryWorkspaceProps> = ({ history, onClearHistory }) => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);

    const handleConfirmClear = () => {
        onClearHistory();
        setIsConfirmModalOpen(false);
    };

    return (
        <>
            <Header title="Istorija Računa" icon={<ArchiveBoxIcon className="w-8 h-8 text-brand-primary" />} />
            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                {history.length > 0 ? (
                    <>
                        <div className="flex justify-end items-center mb-6 gap-3">
                             <button
                                onClick={() => setIsSalesModalOpen(true)}
                                className="flex items-center justify-center gap-2 bg-brand-secondary text-white font-bold py-2 px-5 rounded-lg shadow-sm hover:bg-brand-primary transition-colors"
                            >
                                <DocumentTextIcon className="w-5 h-5" />
                                <span>Dnevni Pazar</span>
                            </button>
                            <button
                                onClick={() => setIsConfirmModalOpen(true)}
                                className="flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-2 px-5 rounded-lg shadow-sm hover:bg-red-600 transition-colors"
                            >
                                <TrashIcon className="w-5 h-5" />
                                <span>Očisti Istoriju</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {history.map(guest => (
                                <PaidGuestCard key={guest.id} guest={guest} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 text-slate-500 bg-white/70 backdrop-blur-md rounded-xl shadow-md">
                        <p className="text-lg">Istorija je prazna.</p>
                        <p className="text-sm mt-2">Plaćeni računi će se pojaviti ovde.</p>
                    </div>
                )}
            </main>
            <ClearHistoryConfirmationModal
                isOpen={isConfirmModalOpen}
                onConfirm={handleConfirmClear}
                onCancel={() => setIsConfirmModalOpen(false)}
            />
            <SalesSummaryModal 
                isOpen={isSalesModalOpen}
                onClose={() => setIsSalesModalOpen(false)}
                history={history}
            />
        </>
    );
};

export default HistoryWorkspace;