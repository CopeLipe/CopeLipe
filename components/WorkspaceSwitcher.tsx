import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './IconComponents';

interface WorkspaceSwitcherProps {
  onSwitch: (direction: 'prev' | 'next') => void;
}

const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({ onSwitch }) => {
  return (
    <>
      {/* Back Button (Left) */}
      <button
        onClick={() => onSwitch('prev')}
        className="fixed top-1/2 -translate-y-1/2 left-0 w-8 h-20 bg-switch-left text-white rounded-r-full flex items-center justify-center shadow-lg hover:w-10 transition-all duration-300 ease-in-out z-40 focus:outline-none focus:ring-2 focus:ring-green-300"
        aria-label="Prethodni radni prostor"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>

      {/* Forward Button (Right) */}
      <button
        onClick={() => onSwitch('next')}
        className="fixed top-1/2 -translate-y-1/2 right-0 w-8 h-20 bg-switch-right text-white rounded-l-full flex items-center justify-center shadow-lg hover:w-10 transition-all duration-300 ease-in-out z-40 focus:outline-none focus:ring-2 focus:ring-orange-300"
        aria-label="Sledeći radni prostor"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>
    </>
  );
};

export default WorkspaceSwitcher;
