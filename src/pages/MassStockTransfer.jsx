import React, { useState } from 'react';
import { elements } from '../theme/elements';
import { useNotification } from '../context/NotificationContext';
import { PageHeader } from '../components/ui';
import { getUnifiedCatalog } from '../utils/catalogUtils';
import Swal from '../utils/tempSwal.jsx';
import { ArrowRightLeft, Plus, Search, Trash2, Loader2, Save, Send } from 'lucide-react';

const STORES = [
    { id: 'madurai', name: 'Madurai' },
    { id: 'chennai', name: 'Chennai' },
    { id: 'trichy', name: 'Trichy' }
];

const MassStockTransfer = () => {
    const { notification } = useNotification();
    const [loading, setLoading] = useState(false);
    
    const [fromStore, setFromStore] = useState('');
    const [toStore, setToStore] = useState('');
    // Transfer items: [ { id, name, category, stock: 100, transferQty: 0 } ]
    const [transferItems, setTransferItems] = useState([]);

    const handleAddMaterial = (e) => {
        const matId = e.target.value;
        if (!matId) return;
        
        if (transferItems.find(i => i.id === matId)) {
            notification("Material already added", "info");
            return;
        }

        const material = getUnifiedCatalog().find(i => i.id === matId);
        if (material) {
            setTransferItems([{
                ...material,
                stock: 150, // Mock stock
                transferQty: ''
            }, ...transferItems]);
        }
    };

    const handleRemoveItem = (id) => {
        setTransferItems(transferItems.filter(i => i.id !== id));
    };

    const handleQtyChange = (id, value) => {
        setTransferItems(transferItems.map(item => {
            if (item.id === id) {
                return { ...item, transferQty: value };
            }
            return item;
        }));
    };

    const handleTransfer = async () => {
        if (!fromStore || !toStore) {
            notification("Please select From and To stores", "warning");
            return;
        }
        if (fromStore === toStore) {
            notification("From and To stores cannot be the same", "error");
            return;
        }
        
        const itemsWithQty = transferItems.filter(i => parseInt(i.transferQty) > 0);
        if (itemsWithQty.length === 0) {
            notification("Please enter transfer quantity for at least one item", "warning");
            return;
        }

        const confirm = await Swal.fire({
            title: 'Confirm Transfer?',
            text: `Transfer ${itemsWithQty.length} material(s) from ${STORES.find(s=>s.id===fromStore)?.name} to ${STORES.find(s=>s.id===toStore)?.name}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Transfer'
        });

        if (confirm.isConfirmed) {
            setLoading(true);
            setTimeout(() => {
                notification("Stock transfer completed successfully!", "success");
                setTransferItems([]);
                setFromStore('');
                setToStore('');
                setLoading(false);
            }, 1200);
        }
    };

    return (
        <div className={elements.pageContainer}>
            <PageHeader
                icon={ArrowRightLeft}
                title="Mass Stock Transfer"
                subtitle="Transfer inventory between stores"
                iconClassName="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-600/30"
                actions={(
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <button
                            onClick={handleTransfer}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-70"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            Complete Transfer
                        </button>
                    </div>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className={elements.card}>
                    <div className={elements.cardHeader}>
                        <h3 className="font-bold text-gray-800 dark:text-white">From Store</h3>
                    </div>
                    <div className={elements.cardBody}>
                        <select
                            value={fromStore}
                            onChange={(e) => setFromStore(e.target.value)}
                            className={elements.selectInput}
                        >
                            <option value="">Select Origin Store</option>
                            {STORES.filter(store => store.id !== toStore).map(store => (
                                <option key={store.id} value={store.id}>{store.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={elements.card}>
                    <div className={elements.cardHeader}>
                        <h3 className="font-bold text-gray-800 dark:text-white">To Store</h3>
                    </div>
                    <div className={elements.cardBody}>
                        <select
                            value={toStore}
                            onChange={(e) => setToStore(e.target.value)}
                            className={elements.selectInput}
                        >
                            <option value="">Select Destination Store</option>
                            {STORES.filter(store => store.id !== fromStore).map(store => (
                                <option key={store.id} value={store.id}>{store.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className={`${elements.card} overflow-hidden flex flex-col`}>
                <div className="bg-gray-50/80 dark:bg-gray-900/40 p-4 border-b border-gray-200 dark:border-gray-800/50 flex items-center justify-between gap-4">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        Transfer List
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs rounded-full">
                            {transferItems.length} items
                        </span>
                    </h3>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700/50 shadow-sm">
                            <tr>
                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 w-1/2">Material</th>
                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right w-32">Current Stock</th>
                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right w-40">Transfer Qty</th>
                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800/50">
                            {/* Selector Row */}
                            <tr className="bg-indigo-50/30 dark:bg-indigo-900/10">
                                <td colSpan="4" className="px-6 py-3">
                                    <div className="relative max-w-md">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <select
                                            onChange={(e) => {
                                                handleAddMaterial(e);
                                                e.target.value = '';
                                            }}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm shadow-sm cursor-pointer transition-all"
                                        >
                                            <option value="">-- Search & Add Material --</option>
                                            {getUnifiedCatalog().sort((a,b)=>a.name.localeCompare(b.name)).map(item => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            
                            {transferItems.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No materials added. Select a material from the dropdown above.
                                    </td>
                                </tr>
                            ) : (
                                transferItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">{item.name}</div>
                                            <div className="text-xs text-indigo-500 mt-1 font-medium">{item.category}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">{item.stock}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <input
                                                type="number"
                                                value={item.transferQty}
                                                onChange={(e) => handleQtyChange(item.id, e.target.value)}
                                                className="w-24 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-900 dark:text-white text-right outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                                placeholder="0"
                                                min="0"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Remove item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MassStockTransfer;
