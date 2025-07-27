import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, size = 'max-w-lg', children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all">
      <div className={`relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full ${size} mx-4 animate-fadeIn`} style={{ maxWidth: size }}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="p-6">{children}</div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
};

export default Modal; 