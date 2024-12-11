import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        info: <AlertCircle className="w-5 h-5 text-blue-500" />
    };

    const bgColors = {
        success: 'bg-green-50',
        error: 'bg-red-50',
        info: 'bg-blue-50'
    };

    const borderColors = {
        success: 'border-green-200',
        error: 'border-red-200',
        info: 'border-blue-200'
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 animate-slide-up">
            <div className={`${bgColors[type]} ${borderColors[type]} border rounded-lg shadow-lg p-4 max-w-md flex items-center gap-3`}>
                {icons[type]}
                <p className="text-gray-700 flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
