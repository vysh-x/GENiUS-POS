import React from 'react';
import { createRoot } from 'react-dom/client';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { ModalShell } from '../components/ui';

const CustomSwalModal = ({ title, text, icon, showCancelButton, confirmButtonText, cancelButtonText, confirmButtonColor, onResolve }) => {
    // Determine icon
    let IconComponent = Info;
    let iconColor = 'text-blue-500';
    let bgColor = 'bg-blue-50 dark:bg-blue-900/30';
    if (icon === 'warning') { IconComponent = AlertCircle; iconColor = 'text-amber-500'; bgColor = 'bg-amber-50 dark:bg-amber-900/30'; }
    if (icon === 'success') { IconComponent = CheckCircle; iconColor = 'text-green-500'; bgColor = 'bg-green-50 dark:bg-green-900/30'; }
    if (icon === 'error') { IconComponent = AlertCircle; iconColor = 'text-red-500'; bgColor = 'bg-red-50 dark:bg-red-900/30'; }

    // Close logic
    const handleClose = (isConfirmed) => {
        onResolve({ isConfirmed });
    };

    return (
        <ModalShell
            overlayClassName="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            panelClassName="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        >
                <div className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto ${bgColor} rounded-full flex items-center justify-center mb-5`}>
                        <IconComponent className={iconColor} size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                    {text && <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{text}</p>}
                </div>
                
                <div className="bg-gray-50/80 dark:bg-gray-900/50 px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-200 dark:border-gray-700/50">
                    {showCancelButton && (
                        <button 
                            onClick={() => handleClose(false)}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors w-full sm:w-auto"
                        >
                            {cancelButtonText || 'Cancel'}
                        </button>
                    )}
                    <button 
                        onClick={() => handleClose(true)}
                        className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all shadow-sm hover:brightness-110 active:scale-95 w-full sm:w-auto`}
                        style={{ backgroundColor: confirmButtonColor || '#3b82f6' }}
                    >
                        {confirmButtonText || 'OK'}
                    </button>
                </div>
        </ModalShell>
    );
};

const Swal = {
    fire: (options) => {
        return new Promise((resolve) => {
            const modalRoot = document.createElement('div');
            // Give it an id so it doesn't conflict
            modalRoot.id = 'carture-custom-swal-root';
            document.body.appendChild(modalRoot);
            
            const root = createRoot(modalRoot);

            const handleResolve = (result) => {
                // slight delay for animation could go here, but instant unmount is fine
                root.unmount();
                if (document.body.contains(modalRoot)) {
                    document.body.removeChild(modalRoot);
                }
                resolve(result);
            };

            root.render(<CustomSwalModal {...options} onResolve={handleResolve} />);
        });
    },
    confirm: (options) => {
        return Swal.fire({ ...options, showCancelButton: true });
    }
};

export default Swal;
