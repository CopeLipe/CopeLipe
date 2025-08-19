
import React, { useState, useCallback, useEffect } from 'react';
import DrinksWorkspace from './components/DrinksWorkspace';
import FoodWorkspace from './components/FoodWorkspace';
import WorkspaceSwitcher from './components/WorkspaceSwitcher';
import HistoryWorkspace from './components/HistoryWorkspace';
import { Drink, Guest, OrderItem } from './types';

const workspaces = ['drinks', 'food', 'history'];

const initialDrinks: Drink[] = [
  { id: 'coke', name: 'Koka-Kola', quantity: 24, emoji: '🥤', price: 200 },
  { id: 'cockta', name: 'Cockta', quantity: 18, emoji: '🥤', price: 200 },
  { id: 'water', name: 'Voda Rosa', quantity: 30, emoji: '💧', price: 120 },
  { id: 'orange-juice', name: 'Next Pomorandža', quantity: 12, emoji: '🍊', price: 200 },
  { id: 'apple-juice', name: 'Somersby Jabuka', quantity: 15, emoji: '🍏', price: 250 },
  { id: 'iced-tea', name: 'Fuze Tea', quantity: 20, emoji: '🍹', price: 200 },
  { id: 'lemonade', name: 'Next Limunada', quantity: 10, emoji: '🍋', price: 200 },
  { id: 'energy-drink', name: 'Red Bull', quantity: 8, emoji: '⚡', price: 300 },
  { id: 'black-coffee', name: 'Domaća kafa', quantity: 30, emoji: '☕', price: 120 },
  { id: 'heineken-small', name: 'Heineken 0.25l', quantity: 24, emoji: '🍺', price: 250 },
];

const App: React.FC = () => {
  const [activeWorkspaceIndex, setActiveWorkspaceIndex] = useState(0);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [history, setHistory] = useState<Guest[]>([]);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedDrinks = localStorage.getItem('drinkInventory');
      setDrinks(savedDrinks ? JSON.parse(savedDrinks) : initialDrinks);
      const savedGuests = localStorage.getItem('guestTabs');
      setGuests(savedGuests ? JSON.parse(savedGuests) : []);
      const savedHistory = localStorage.getItem('guestHistory');
      setHistory(savedHistory ? JSON.parse(savedHistory) : []);
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setDrinks(initialDrinks);
      setGuests([]);
      setHistory([]);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem('drinkInventory', JSON.stringify(drinks));
    } catch (error) {
      console.error("Failed to save drinks to localStorage", error);
    }
  }, [drinks]);
  
  useEffect(() => {
    try {
        localStorage.setItem('guestTabs', JSON.stringify(guests));
    } catch (error) {
      console.error("Failed to save guests to localStorage", error);
    }
  }, [guests]);

  useEffect(() => {
    try {
        localStorage.setItem('guestHistory', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  const handleSwitchWorkspace = useCallback((direction: 'prev' | 'next') => {
    setActiveWorkspaceIndex(currentIndex => {
      if (direction === 'next') {
        return (currentIndex + 1) % workspaces.length;
      } else {
        return (currentIndex - 1 + workspaces.length) % workspaces.length;
      }
    });
  }, []);

  const handleUpdateQuantity = useCallback((drinkId: string, amount: number) => {
    setDrinks(prevDrinks =>
      prevDrinks.map(drink =>
        drink.id === drinkId
          ? { ...drink, quantity: Math.max(0, drink.quantity + amount) }
          : drink
      )
    );
  }, []);

  const handleAddOrUpdateDrink = useCallback((newDrinkData: Omit<Drink, 'id'>) => {
    setDrinks(prevDrinks => {
      const existingDrinkIndex = prevDrinks.findIndex(d => d.name.toLowerCase() === newDrinkData.name.toLowerCase());

      if (existingDrinkIndex !== -1) {
        const updatedDrinks = [...prevDrinks];
        const currentDrink = updatedDrinks[existingDrinkIndex];
        updatedDrinks[existingDrinkIndex] = {
          ...currentDrink,
          quantity: currentDrink.quantity + newDrinkData.quantity,
          emoji: newDrinkData.emoji,
        };
        return updatedDrinks;
      } else {
        const newDrink: Drink = {
          ...newDrinkData,
          id: newDrinkData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        };
        return [...prevDrinks, newDrink];
      }
    });
  }, []);
  
  const handleDeleteDrink = useCallback((drinkId: string) => {
    setDrinks(prevDrinks => prevDrinks.filter(drink => drink.id !== drinkId));
  }, []);

  const handleAddGuest = useCallback((name: string) => {
    if (name.trim()) {
        const newGuest: Guest = {
            id: `guest-${Date.now()}`,
            name: name.trim(),
            orders: [],
        };
        setGuests(prevGuests => [...prevGuests, newGuest]);
    }
  }, []);

  const handleDeleteGuest = useCallback((guestId: string) => {
    setGuests(prevGuests => prevGuests.filter(g => g.id !== guestId));
  }, []);

  const handleAddDrinkToGuest = useCallback((guestId: string, drinkId: string) => {
    const drinkToAdd = drinks.find(d => d.id === drinkId);
    if (!drinkToAdd || drinkToAdd.quantity <= 0) return;

    handleUpdateQuantity(drinkId, -1);

    setGuests(prevGuests => prevGuests.map(guest => {
        if (guest.id === guestId) {
            const existingOrderIndex = guest.orders.findIndex(o => o.drinkId === drinkId);
            let newOrders: OrderItem[];
            if (existingOrderIndex > -1) {
                newOrders = guest.orders.map((order, index) => 
                    index === existingOrderIndex ? { ...order, quantity: order.quantity + 1 } : order
                );
            } else {
                newOrders = [...guest.orders, { drinkId, name: drinkToAdd.name, quantity: 1, pricePerItem: drinkToAdd.price }];
            }
            return { ...guest, orders: newOrders };
        }
        return guest;
    }));
  }, [drinks, handleUpdateQuantity]);
  
  const handleGuestPayment = useCallback((guestId: string) => {
    setGuests(currentGuests => {
      const guestToMove = currentGuests.find(g => g.id === guestId);
      if (!guestToMove) return currentGuests;

      const updatedGuest = { ...guestToMove, paidAt: new Date().toISOString() };
      setHistory(currentHistory => [updatedGuest, ...currentHistory]);
      
      return currentGuests.filter(g => g.id !== guestId);
    });
  }, []);
  
  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const activeWorkspace = workspaces[activeWorkspaceIndex];

  return (
    <div className="min-h-screen font-sans text-slate-800">
      <WorkspaceSwitcher onSwitch={handleSwitchWorkspace} />
      
      <div className={`transition-opacity duration-300 ${activeWorkspace === 'drinks' ? 'opacity-100' : 'opacity-0 absolute w-full top-0 left-0'}`} style={{ visibility: activeWorkspace === 'drinks' ? 'visible' : 'hidden' }}>
        <DrinksWorkspace
            drinks={drinks}
            onUpdateQuantity={handleUpdateQuantity}
            onAddOrUpdateDrink={handleAddOrUpdateDrink}
            onDeleteDrink={handleDeleteDrink}
            onReorder={setDrinks}
        />
      </div>
      
      <div className={`transition-opacity duration-300 ${activeWorkspace === 'food' ? 'opacity-100' : 'opacity-0 absolute w-full top-0 left-0'}`} style={{ visibility: activeWorkspace === 'food' ? 'visible' : 'hidden' }}>
        <FoodWorkspace
            drinks={drinks}
            guests={guests}
            onAddGuest={handleAddGuest}
            onDeleteGuest={handleDeleteGuest}
            onAddDrinkToGuest={handleAddDrinkToGuest}
            onGuestPaid={handleGuestPayment}
        />
      </div>

      <div className={`transition-opacity duration-300 ${activeWorkspace === 'history' ? 'opacity-100' : 'opacity-0 absolute w-full top-0 left-0'}`} style={{ visibility: activeWorkspace === 'history' ? 'visible' : 'hidden' }}>
        <HistoryWorkspace history={history} onClearHistory={handleClearHistory} />
      </div>
    </div>
  );
};

export default App;