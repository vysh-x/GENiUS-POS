import React, { useCallback, useEffect, useState } from 'react';
import { elements } from '../theme/elements';
import { useNotification } from '../context/NotificationContext';
import { PageHeader } from '../components/ui';
import { ChevronLeft, ChevronRight, Store, Loader2, RefreshCw } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { getUnifiedCatalog } from '../utils/catalogUtils';

const STORES_CONFIG = [
    { store: 'Madurai', schema: 'geniusmdu' },
    { store: 'Chennai', schema: 'geniuschn' },
    { store: 'Trichy', schema: 'geniustry' }
];

// Generate robust dummy data for any date
const generateDummyData = () => {
    const data = {
        salesSummary: {},
        detailedData: {},
        totalAmounts: {}
    };

    STORES_CONFIG.forEach(store => {
        // Randomize whether a store has sales or not to show different states
        const hasSales = Math.random() > 0.1; // 90% chance of having sales
        
        if (hasSales) {
            const count = Math.floor(Math.random() * 50) + 20;
            const bamountTotal = Math.floor(Math.random() * 500000) + 100000;
            const amountTotal = bamountTotal + Math.floor(Math.random() * 50000); // SP > MRP

            data.salesSummary[store.schema] = {
                sum: amountTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
                count
            };

            data.totalAmounts[store.schema] = {
                amount: amountTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
                bamount: bamountTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })
            };

            data.detailedData[store.schema] = {};
            
            const catalog = getUnifiedCatalog();
            
            let remainingBamount = bamountTotal;
            let remainingAmount = amountTotal;

            for (let i = 0; i < 15; i++) {
                const randomItem = catalog[Math.floor(Math.random() * catalog.length)];
                const matdesc = randomItem ? randomItem.name : `Item ${i+1}`;
                const sqty = Math.floor(Math.random() * 100) + 1;
                
                // Distribute amounts mathematically so they sum correctly
                const bAmt = i === 14 ? remainingBamount : Math.floor(remainingBamount / (15 - i) * (0.8 + Math.random() * 0.4));
                const sAmt = i === 14 ? remainingAmount : Math.floor(remainingAmount / (15 - i) * (0.8 + Math.random() * 0.4));
                
                remainingBamount -= bAmt;
                remainingAmount -= sAmt;

                data.detailedData[store.schema][`MAT${i}`] = {
                    matdesc: `${matdesc} (Batch ${i+1})`,
                    sqty,
                    bamount: bAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
                    amount: sAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })
                };
            }
        }
    });

    return data;
};

const TotalSalesAcrossStores = () => {
    const { notification: notify } = useNotification();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [maxDate] = useState(new Date());
    
    const [salesSummary, setSalesSummary] = useState({});
    const [detailedData, setDetailedData] = useState({});
    const [totalAmounts, setTotalAmounts] = useState({});
    
    const [selectedSchema, setSelectedSchema] = useState(STORES_CONFIG[0].schema);

    const fetchSalesData = useCallback(() => {
        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            const dummy = generateDummyData();
            setSalesSummary(dummy.salesSummary);
            setDetailedData(dummy.detailedData);
            setTotalAmounts(dummy.totalAmounts);
            setLoading(false);
        }, 800);
    }, []);

    useEffect(() => {
        fetchSalesData();
    }, [currentDate, fetchSalesData]);

    const handleUpdateAmounts = () => {
        setUpdating(true);
        setTimeout(() => {
            notify("Amounts synced securely", 'success');
            fetchSalesData();
            setUpdating(false);
        }, 1200);
    };

    const changeDate = (days) => {
        const newDate = days > 0 ? addDays(currentDate, days) : subDays(currentDate, Math.abs(days));
        if (newDate > maxDate) return;
        setCurrentDate(newDate);
    };

    const selectedStoreDetails = selectedSchema ? detailedData[selectedSchema] || {} : {};
    const selectedStoreTotals = selectedSchema ? totalAmounts[selectedSchema] || { amount: '0.00', bamount: '0.00' } : { amount: '0.00', bamount: '0.00' };
    const selectedStoreName = STORES_CONFIG.find(s => s.schema === selectedSchema)?.store || '';

    return (
        <div className={elements.pageContainer}>
            <PageHeader
                icon={Store}
                title="Genius Group"
                subtitle="Total Sales Across Stores"
                iconClassName="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-600/30"
                actions={(
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <button
                            onClick={handleUpdateAmounts}
                            disabled={updating}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:text-gray-200 text-white rounded-xl transition-all font-bold shadow-lg shadow-indigo-600/20 active:scale-95"
                        >
                            {updating ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                            {updating ? 'Syncing...' : 'Update Amounts'}
                        </button>
                    </div>
                )}
            />

            <div className="flex flex-col md:flex-row gap-6 mb-4">
                {/* Left Sidebar: Date & Store List */}
                <div className="w-full md:w-80 flex flex-col gap-6">
                    {/* Date Picker Card */}
                    <div className={elements.card}>
                        <div className={`${elements.cardBody} flex items-center justify-between gap-2 p-4`}>
                            <button
                                onClick={() => changeDate(-1)}
                                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl transition-colors shadow-sm"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 py-2 px-4 rounded-xl text-center font-bold">
                                {format(currentDate, 'dd MMM yyyy')}
                            </div>
                            <button
                                onClick={() => changeDate(1)}
                                disabled={currentDate >= maxDate}
                                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Store List Card */}
                    <div className={`${elements.card} flex-1 md:overflow-hidden flex flex-col`}>
                        <div className={`${elements.cardHeader} bg-gray-50/50 dark:bg-gray-900/30`}>
                            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Select Store</h3>
                        </div>
                        <div className="flex-1 overflow-x-auto md:overflow-y-auto custom-scrollbar p-2">
                            <div className="flex flex-row md:flex-col gap-2 min-w-max md:min-w-0">
                                {STORES_CONFIG.map((store) => {
                                    const summary = salesSummary[store.schema];
                                    const hasData = summary && summary.count > 0;
                                    const isSelected = selectedSchema === store.schema;

                                    return (
                                        <button
                                            key={store.schema}
                                            onClick={() => setSelectedSchema(store.schema)}
                                            className={`w-48 md:w-full shrink-0 relative p-4 rounded-xl border-2 transition-all text-left flex flex-col gap-1.5
                                                ${isSelected
                                                    ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-500 shadow-sm'
                                                    : 'bg-white dark:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                                }`}
                                        >
                                            <div className={`absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full shadow-sm ${hasData ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className={`font-black text-sm uppercase tracking-wider truncate ${isSelected ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                {store.store}
                                            </span>
                                            <span className="text-lg font-black text-gray-900 dark:text-white">
                                                ₹{summary?.sum || '0.00'}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Table Details */}
                <div className={`${elements.card} flex-1 flex flex-col overflow-hidden`}>
                    {/* Table Header / Stats */}
                    <div className={`${elements.cardHeader} flex flex-wrap items-center justify-between gap-6 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30 p-6`}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Store size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white">{selectedStoreName}</h2>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {format(currentDate, 'dd MMM yyyy')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total MRP</span>
                                <span className="text-lg font-black text-gray-900 dark:text-white">
                                    ₹{selectedStoreTotals.bamount || '0.00'}
                                </span>
                            </div>
                            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Total SP</span>
                                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                                    ₹{selectedStoreTotals.amount || '0.00'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="flex-1 overflow-auto custom-scrollbar">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4 py-20 text-indigo-500">
                                <Loader2 className="animate-spin" size={36} />
                                <p className="font-bold text-gray-500">Syncing sales data...</p>
                            </div>
                        ) : Object.keys(selectedStoreDetails).length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm z-10 border-b border-gray-200 dark:border-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Material</th>
                                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Qty</th>
                                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">MRP Value</th>
                                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">SP Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800/50">
                                    {Object.values(selectedStoreDetails).map((row, idx) => (
                                        <tr key={idx} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-gray-100">{row.matdesc}</td>
                                            <td className="px-6 py-4 text-sm text-right font-bold text-gray-600 dark:text-gray-300">{row.sqty}</td>
                                            <td className="px-6 py-4 text-sm text-right font-medium text-gray-500 dark:text-gray-400">₹{row.bamount}</td>
                                            <td className="px-6 py-4 text-sm text-right font-black text-indigo-600 dark:text-indigo-400">₹{row.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-20 text-center text-gray-500">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                                    <Store size={32} className="text-gray-300 dark:text-gray-600" />
                                </div>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">No sales recorded.</p>
                                <p className="text-sm mt-1">Try selecting a different date or click "Update Amounts".</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalSalesAcrossStores;
