import React, { useState, useEffect } from 'react';
import { elements } from '../theme/elements';
import { useNotification } from '../context/NotificationContext';
import { PageHeader } from '../components/ui';
import Swal from '../utils/tempSwal.jsx';
import { Save, Search, DollarSign, ChevronsRight, Loader2, Tag } from 'lucide-react';
import { getUnifiedCatalog, getUnifiedCategories } from '../utils/catalogUtils';

const STORES = [
    { id: 'madurai', name: 'Madurai', isMain: true },
    { id: 'chennai', name: 'Chennai', isMain: false },
    { id: 'trichy', name: 'Trichy', isMain: false }
];

const SellingPriceMaster = () => {
    const { notification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const unifiedCategs = getUnifiedCategories();
    const [selectedCategory, setSelectedCategory] = useState(unifiedCategs.length > 0 ? unifiedCategs[0].name : 'All');
    
    // prices: { [itemId]: { madurai: '0.00', chennai: '0.00', trichy: '0.00' } }
    const [prices, setPrices] = useState({});

    // Initialize prices on mount
    useEffect(() => {
        const initialPrices = {};
        getUnifiedCatalog().forEach(item => {
            initialPrices[item.id] = { madurai: '', chennai: '', trichy: '' };
        });
        setPrices(initialPrices);
    }, []);

    const handlePriceChange = (itemId, storeId, value) => {
        // Allow only numbers and decimals
        if (value && !/^\d*\.?\d*$/.test(value)) return;

        setPrices(prev => {
            const currentItemPrices = prev[itemId] || { madurai: '', chennai: '', trichy: '' };
            const newPrices = { ...currentItemPrices, [storeId]: value };

            // Auto-fill logic: if Madurai changes, and others are empty or we want to strictly auto-fill
            // Let's implement strict auto-fill: if Madurai changes, overwrite others immediately for convenience.
            if (storeId === 'madurai') {
                newPrices.chennai = value;
                newPrices.trichy = value;
            }

            return { ...prev, [itemId]: newPrices };
        });
    };

    const handleCopyAll = (itemId) => {
        setPrices(prev => {
            const currentItemPrices = prev[itemId];
            if (!currentItemPrices) return prev;
            const mainPrice = currentItemPrices.madurai;
            return {
                ...prev,
                [itemId]: {
                    ...currentItemPrices,
                    chennai: mainPrice,
                    trichy: mainPrice
                }
            };
        });
        notification("Prices copied to all stores", "success");
    };

    const handleSave = async () => {
        const confirm = await Swal.fire({
            title: 'Update Prices?',
            text: 'Are you sure you want to update the selling prices across all stores?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Update'
        });

        if (confirm.isConfirmed) {
            setLoading(true);
            setTimeout(() => {
                notification("Selling prices updated successfully!", "success");
                setLoading(false);
            }, 1000);
        }
    };

    const filteredItems = getUnifiedCatalog().filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={elements.pageContainer}>
            <PageHeader
                icon={DollarSign}
                title="Selling Price Master"
                subtitle="Set store-wise selling prices for all materials"
                iconClassName="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-600/30"
                actions={(
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search materials..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`${elements.input} pl-10 w-full md:w-64`}
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-70"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Update
                        </button>
                    </div>
                )}
            />

            <div className={`${elements.card} overflow-hidden flex flex-col`}>
                {/* Category Filters */}
                <div className="bg-gray-50/80 dark:bg-gray-900/40 p-4 border-b border-gray-200 dark:border-gray-800/50 flex items-center gap-2 overflow-x-auto custom-scrollbar">
                    <button
                        onClick={() => setSelectedCategory('All')}
                        className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                            selectedCategory === 'All'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        All Categories
                    </button>
                    {unifiedCategs.map(catObj => (
                        <button
                            key={catObj.name}
                            onClick={() => setSelectedCategory(catObj.name)}
                            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                                selectedCategory === catObj.name
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            <Tag size={14} className={selectedCategory === catObj.name ? 'text-indigo-200' : 'text-gray-400'} />
                            {catObj.name}
                        </button>
                    ))}
                </div>

                {/* Main Table */}
                <div className="overflow-x-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700/50 shadow-sm">
                            <tr>
                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 w-1/3">
                                    Material
                                </th>
                                {STORES.map(store => (
                                    <th key={store.id} className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            {store.name}
                                            {store.isMain && <span className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded text-[10px] ml-1">MAIN</span>}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">
                                    Records
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800/50">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={STORES.length + 2} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No materials found for this search.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => {
                                    const itemPrices = prices[item.id] || { madurai: '', chennai: '', trichy: '' };
                                    const hasAllPrices = parseFloat(itemPrices.madurai || '0') > 0 && parseFloat(itemPrices.chennai || '0') > 0 && parseFloat(itemPrices.trichy || '0') > 0;

                                    return (
                                        <tr key={item.id} className="hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">{item.name}</div>
                                                <div className="text-xs text-indigo-500 mt-1 font-medium">{item.category}</div>
                                            </td>
                                            
                                            {/* Madurai (Main Store) Input + Copy Button */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
                                                        <input
                                                            type="text"
                                                            value={itemPrices.madurai}
                                                            onChange={(e) => handlePriceChange(item.id, 'madurai', e.target.value)}
                                                            className="w-28 pl-7 pr-3 py-2 bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800/50 rounded-lg text-sm font-bold text-indigo-700 dark:text-indigo-400 text-right outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => handleCopyAll(item.id)}
                                                        className="p-2 bg-gray-100 hover:bg-indigo-100 dark:bg-gray-800 dark:hover:bg-indigo-900/50 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-lg transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                                                        title="Copy price to all stores"
                                                    >
                                                        <ChevronsRight size={16} />
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Chennai Input */}
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center">
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
                                                        <input
                                                            type="text"
                                                            value={itemPrices.chennai}
                                                            onChange={(e) => handlePriceChange(item.id, 'chennai', e.target.value)}
                                                            className="w-28 pl-7 pr-3 py-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 text-right outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Trichy Input */}
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center">
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
                                                        <input
                                                            type="text"
                                                            value={itemPrices.trichy}
                                                            onChange={(e) => handlePriceChange(item.id, 'trichy', e.target.value)}
                                                            className="w-28 pl-7 pr-3 py-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 text-right outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status / Records */}
                                            <td className="px-4 py-4 text-center">
                                                <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold ${
                                                    hasAllPrices 
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                        : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                                }`}>
                                                    {hasAllPrices ? '3/3' : '0/3'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellingPriceMaster;
