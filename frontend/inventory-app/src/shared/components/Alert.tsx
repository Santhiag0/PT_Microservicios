import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export const Alert = ({ type, message, onClose }: AlertProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`p-4 rounded-lg flex items-center justify-between ${
      type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      <p className="flex-1">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 p-1 hover:bg-opacity-20 hover:bg-black rounded-full transition-colors"
      >
        <FiX className="w-5 h-5" />
      </button>
    </div>
  );
}; 