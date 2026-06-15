import React, { useState, useEffect, useMemo } from 'react';
import { elements } from '../theme/elements';
import { useNotification } from '../context/NotificationContext';
import { PageHeader } from '../components/ui';
import { getUnifiedCatalog, getUnifiedCategories, getUnifiedSubcategories } from '../utils/catalogUtils';
import { Package, Search, CreditCard, Loader2, Save } from 'lucide-react';

const MassInvoice = () => {
    const notify = useNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const unifiedCategs = getUnifiedCategories();
    const [activeCategory, setActiveCategory] = useState(unifiedCategs[0]?.name || '');
    const [gridData, setGridData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Initial load from local storage
    useEffect(() => {
        const stored = localStorage.getItem('mass_invoice_draft');
        if (stored) {
            try {
                setGridData(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to load draft', e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (Object.keys(gridData).length > 0) {
            localStorage.setItem('mass_invoice_draft', JSON.stringify(gridData));
        }
    }, [gridData]);

    const handleInput = (itemId, field, value) => {
        const numVal = parseInt(value) || 0;
        setGridData(prev => {
            const current = prev[itemId] || { opening: 100, closing: 100, sales: 0 }; // Mock base defaults
            
            let updated = { ...current };
            if (field === 'sales') {
                updated.sales = numVal;
                updated.closing = current.opening - numVal;
            } else if (field === 'closing') {
                updated.closing = numVal;
                updated.sales = current.opening - numVal;
            }
            
            return { ...prev, [itemId]: updated };
        });
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            notify.notification('Invoice saved successfully!', 'success');
            setGridData({});
            localStorage.removeItem('mass_invoice_draft');
            setIsSaving(false);
        }, 800);
    };

    // Filter items based on active category and search term
    const displayedItems = useMemo(() => {
        let items = getUnifiedCatalog().filter(item => {
            // Check if item's subcategory belongs to activeCategory
            const sub = getUnifiedSubcategories().find(s => s.scateg === item.subcategory);
            return sub && sub.categ === activeCategory;
        });

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            items = items.filter(item => item.name.toLowerCase().includes(lowerSearch));
        }

        return items;
    }, [activeCategory, searchTerm]);

    // Calculate totals
    const totalSalesValue = useMemo(() => {
        let total = 0;
        Object.keys(gridData).forEach(key => {
            const row = gridData[key];
            if (row.sales > 0) {
                total += row.sales * row.mrp;
            }
        });
        return total;
    }, [gridData]);

    return (
        <div className={elements.pageContainer}>
            <PageHeader
                icon={Package}
                title="Mass Invoice"
                subtitle="Manage end-of-day sales efficiently"
                iconClassName="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-600/30"
                actions={(
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => notify.notification('Draft saved successfully!', 'success')}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
                        >
                            <Save size={16} />
                            Save Draft
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || totalSalesValue === 0}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                            Save Invoice
                        </button>
                    </div>
                )}
            />

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
                
                {/* Controls Area */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50">
                    {/* Category Tabs */}
                    <div className="flex overflow-x-auto hide-scrollbar gap-2 w-full sm:w-2/3">
                        {unifiedCategs.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => setActiveCategory(cat.name)}
                                className={`px-4 py-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all
                                    ${activeCategory === cat.name 
                                        ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-200 dark:border-gray-600' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border border-transparent'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-1/3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search materials..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white transition-shadow"
                        />
                    </div>
                </div>

                {/* Table Area */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-800/80 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Material</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">MRP</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Opening Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right w-40">Closing Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right w-40">Sales Qty</th>
                                <th className="px-6 py-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-right">Sales Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                            {displayedItems.length > 0 ? displayedItems.map((item) => {
                                const rowState = gridData[item.id] || { opening: 100, closing: 100, sales: 0 };
                                const val = rowState.sales * (item.mrp || 0);
                                
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 text-right">₹{item.mrp}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 text-right">{rowState.opening}</td>
                                        <td className="px-6 py-3">
                                            <input 
                                                type="number"
                                                value={rowState.closing === 100 && rowState.sales === 0 ? '' : rowState.closing}
                                                onChange={(e) => handleInput(item.id, 'closing', e.target.value)}
                                                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-right focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white font-medium"
                                            />
                                        </td>
                                        <td className="px-6 py-3">
                                            <input 
                                                type="number"
                                                value={rowState.sales === 0 ? '' : rowState.sales}
                                                onChange={(e) => handleInput(item.id, 'sales', e.target.value)}
                                                className="w-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg px-3 py-2 text-right focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-700 dark:text-indigo-300 font-bold"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white text-right">
                                            {val > 0 ? `₹${val.toLocaleString()}` : '-'}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No items found for this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MassInvoice;
