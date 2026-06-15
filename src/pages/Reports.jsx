import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { elements } from '../theme/elements';
import { ModalShell, PageHeader } from '../components/ui';
import { mockReportsData } from '../data/mockReportsData';
import { getUnifiedCatalog } from '../utils/catalogUtils';
import { 
    FileText, Download, Printer, Search, TrendingUp, Package, 
    ShoppingCart, ShieldAlert, ChevronRight, ChevronLeft, ArrowUpDown, Filter, X
} from 'lucide-react';

const reportCategories = [
    { id: 'sales', name: 'Sales Report', icon: TrendingUp, desc: 'Daily/Shift revenue and covers', permission: 'reports_sales' },
    { id: 'inventory', name: 'Inventory Report', icon: Package, desc: 'Stock levels and valuations', permission: 'reports_inventory' },
    { id: 'purchase', name: 'Purchase Report', icon: ShoppingCart, desc: 'Vendor invoices and orders', permission: 'reports_purchase' },
    { id: 'audit', name: 'Audit Report', icon: ShieldAlert, desc: 'System logs, voids, and comps', permission: 'reports_audit' }
];

const Reports = () => {
    const { user, actionPermissions } = useAuth();
    const { notification } = useNotification();
    
    // State
    const [activeCategory, setActiveCategory] = useState('sales');
    const [searchTerm, setSearchTerm] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Popup
    const [selectedBill, setSelectedBill] = useState(null);
    const [billDetails, setBillDetails] = useState(null);
    
    // Sorting
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    
    // Advanced Filters
    const [timeframe, setTimeframe] = useState('all'); // all, daily, monthly, quarterly
    const [priceFilter, setPriceFilter] = useState('all'); // all, high, low
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const userRole = (user?.accesslevel || 'store').toLowerCase();
    const permissions = actionPermissions[userRole] || {};

    // Permissions logic
    const visibleCategories = reportCategories.filter(cat => {
        if (cat.id === 'audit' && permissions.reports_audit === false) return false;
        if (cat.id === 'inventory' && permissions.reports_inventory === false) return false;
        return true; 
    });

    const canExport = permissions.reports_export !== false;

    // Format currency helper
    const formatMoney = (val) => {
        if (typeof val === 'number') return `₹${val.toFixed(2)}`;
        return val;
    };

    // 1. Get raw data
    const rawData = useMemo(() => {
        if (activeCategory === 'inventory') {
            const catalog = getUnifiedCatalog().slice(0, 30);
            return catalog.map(item => {
                const stock = item.stock || Math.floor(Math.random() * 80) + 5;
                const cost = item.mrp ? parseFloat(item.mrp) : 250;
                return {
                    id: item.id,
                    "Item Name": item.name,
                    "Category": item.category || 'Uncategorized',
                    "Unit Cost": cost,
                    "Stock Level": stock,
                    "Reorder Level": 10,
                    "Total Value": cost * stock,
                    "Status": stock > 10 ? "In Stock" : "Low Stock"
                };
            });
        }
        return mockReportsData[activeCategory] || [];
    }, [activeCategory]);

    // 2. Apply Filters & Search
    const filteredData = useMemo(() => {
        return rawData.filter(row => {
            // Search Bar
            if (searchTerm) {
                const searchMatch = Object.values(row).some(val => 
                    String(val).toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (!searchMatch) return false;
            }

            // Timeframe filter (dummy logic for dates)
            if (timeframe !== 'all') {
                const rowDate = row.date || row.invoice_date || row.timestamp;
                if (rowDate) {
                    const today = new Date('2026-06-01');
                    const itemDate = new Date(rowDate);
                    const diffTime = Math.abs(today - itemDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                    
                    if (timeframe === 'daily' && diffDays > 1) return false;
                    if (timeframe === 'monthly' && diffDays > 30) return false;
                    if (timeframe === 'quarterly' && diffDays > 90) return false;
                }
            }

            // Price/Value filter
            if (priceFilter !== 'all') {
                const val = row.total_sales || row.total_value || row.total_amount || row['Total Amount'];
                if (val !== undefined) {
                    if (priceFilter === 'high' && val < 1000) return false;
                    if (priceFilter === 'low' && val >= 1000) return false;
                }
            }

            return true;
        });
    }, [rawData, searchTerm, timeframe, priceFilter]);

    // 3. Apply Sorting
    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    // 4. Apply Pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handlers
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleCategoryChange = (id) => {
        setActiveCategory(id);
        setCurrentPage(1);
        setSortConfig({ key: null, direction: 'asc' });
        setSearchTerm('');
        setTimeframe('all');
        setPriceFilter('all');
    };

    const handleExport = (type) => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            notification(`${type} Report downloaded! (Includes ${sortedData.length} records)`, 'success');
        }, 1500);
    };

    const renderTableHeaders = () => {
        if (!paginatedData.length) return null;
        const keys = Object.keys(paginatedData[0]).filter(k => k !== 'id');
        return keys.map(k => (
            <th 
                key={k} 
                onClick={() => requestSort(k)}
                className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
            >
                <div className="flex items-center gap-1">
                    {k.replace(/_/g, ' ')}
                    <ArrowUpDown size={14} className={`text-gray-400 group-hover:text-blue-500 ${sortConfig.key === k ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                </div>
            </th>
        ));
    };

    const renderTableRows = () => {
        if (!paginatedData.length) {
            return (
                <tr>
                    <td colSpan="100%" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                            <FileText size={32} className="text-gray-300 mb-2" />
                            <p>No records found for your complex filter criteria.</p>
                        </div>
                    </td>
                </tr>
            );
        }

        return paginatedData.map(row => (
            <tr 
                key={row.id} 
                className={`hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b border-gray-200 dark:border-gray-700/50 last:border-0 ${activeCategory === 'sales' ? 'cursor-pointer group' : ''}`}
                onClick={() => {
                    if (activeCategory === 'sales') {
                        // Generate mock bill details on the fly using REAL catalog prices
                        const itemsCount = row['Items'] || 1;
                        const items = [];
                        const catalog = getUnifiedCatalog();
                        
                        // Fallback if catalog is somehow empty
                        const fallbackPrice = 250; 

                        for (let i = 0; i < itemsCount; i++) {
                            const randomCatalogItem = catalog[Math.floor(Math.random() * catalog.length)];
                            const price = randomCatalogItem && randomCatalogItem.mrp ? parseFloat(randomCatalogItem.mrp) : fallbackPrice;
                            items.push({ 
                                name: randomCatalogItem ? randomCatalogItem.name : `Item ${i+1}`, 
                                qty: 1, 
                                rate: price, 
                                amount: price 
                            });
                        }
                        
                        const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
                        const gst = subtotal * 0.05;
                        const cgst = gst / 2;
                        const sgst = gst / 2;
                        const grandTotal = Math.round(subtotal + gst);
                        
                        setBillDetails({ items, subtotal, cgst, sgst, grandTotal });
                        setSelectedBill(row);
                    }
                }}
            >
                {Object.entries(row).map(([key, val]) => {
                    if (key === 'id') return null;
                    
                    let displayVal = val;
                    const lowerKey = key.toLowerCase();
                    if (typeof val === 'number' && (lowerKey.includes('sales') || lowerKey.includes('value') || lowerKey.includes('amount') || lowerKey.includes('cost') || lowerKey.includes('avg'))) {
                        displayVal = formatMoney(val);
                    }
                    
                    // Special styling for status badges
                    if (lowerKey === 'status' || lowerKey === 'severity') {
                        let badgeColor = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
                        if (val === 'Completed' || val === 'In Stock' || val === 'Paid' || val === 'Low') badgeColor = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
                        if (val === 'Pending' || val === 'Low Stock') badgeColor = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
                        if (val === 'Critical' || val === 'Overdue' || val === 'High') badgeColor = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
                        
                        return (
                            <td key={key} className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${badgeColor}`}>
                                    {val}
                                </span>
                            </td>
                        );
                    }

                    return <td key={key} className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{displayVal}</td>;
                })}
            </tr>
        ));
    };

    return (
        <div className={elements.pageContainer}>
            <PageHeader
                icon={FileText}
                title="Reports"
                subtitle="View and analyse your business data"
                iconClassName="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-600/30"
                actions={canExport && (
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <button 
                            onClick={() => handleExport('Excel')}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors disabled:opacity-50 text-sm font-medium shadow-sm"
                        >
                            <Download size={18} />
                            Export ({sortedData.length})
                        </button>
                        <button 
                            onClick={() => handleExport('PDF')}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 text-sm font-medium shadow-sm"
                        >
                            <Printer size={18} />
                            Print PDF
                        </button>
                    </div>
                )}
            />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-72 shrink-0 space-y-2">
                    <h3 className={elements.sectionTitle}>Data Models</h3>
                    {visibleCategories.map(cat => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                                    isActive 
                                    ? 'bg-white dark:bg-gray-800 shadow-sm border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 scale-[1.02]' 
                                    : 'hover:bg-white/60 dark:hover:bg-gray-800/60 text-gray-600 dark:text-gray-400 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-sm">{cat.name}</div>
                                    </div>
                                </div>
                                <ChevronRight size={16} className={`transition-transform ${isActive ? 'translate-x-1' : 'opacity-0'}`} />
                            </button>
                        );
                    })}
                </div>

                {/* Main Data Area */}
                <div className="flex-1 space-y-4">
                    {/* Advanced Filter Bar */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-500 font-medium w-full md:w-auto">
                            <Filter size={18} />
                            <span>Filters:</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row w-full gap-3">
                            <select 
                                value={timeframe} 
                                onChange={(e) => { setTimeframe(e.target.value); setCurrentPage(1); }}
                                className={`${elements.selectInput} w-full sm:w-auto`}
                            >
                                <option value="all">All Time</option>
                                <option value="daily">Daily (Last 24h)</option>
                                <option value="monthly">Monthly (Last 30d)</option>
                                <option value="quarterly">Quarterly (Last 90d)</option>
                            </select>

                            <select 
                                value={priceFilter} 
                                onChange={(e) => { setPriceFilter(e.target.value); setCurrentPage(1); }}
                                className={`${elements.selectInput} w-full sm:w-auto`}
                            >
                                <option value="all">Any Value</option>
                                <option value="high">High Value (&gt;₹1k)</option>
                                <option value="low">Low Value (&lt;₹1k)</option>
                            </select>

                            <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search specific records..."
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 sticky top-0 backdrop-blur-sm z-10">
                                    <tr>
                                        {renderTableHeaders()}
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows()}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        {totalPages > 1 && (
                            <div className="bg-gray-50/50 dark:bg-gray-900/30 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-500">
                                    Showing <span className="font-semibold text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{sortedData.length}</span> results
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors">
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span className="text-sm font-medium px-2">{currentPage} / {totalPages}</span>
                                    <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Wobpos Style Printbill Popup */}
            {selectedBill && billDetails && (
                <ModalShell
                    onClose={() => setSelectedBill(null)}
                    overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    panelClassName="bg-white text-black p-6 w-full max-w-sm font-mono text-sm shadow-2xl relative mx-auto my-8 animate-in zoom-in duration-200 cursor-default"
                    panelStyle={{ borderTop: '4px solid #1f2937' }}
                >
                        <button onClick={() => setSelectedBill(null)} className="absolute -top-12 right-0 text-white hover:text-gray-300">
                            <X size={28} />
                        </button>
                        
                        <div className="text-center mb-4 border-b border-dashed border-gray-400 pb-4">
                            <h2 className="text-xl font-bold uppercase tracking-widest">Madurai Store</h2>
                            <p className="text-xs mt-1 text-gray-600">123 MDU Street, Madurai</p>
                            <p className="text-xs text-gray-600">GSTIN: 33AAAAA0000A1Z5</p>
                            <p className="text-xs text-gray-600">Tel: +91 99999 00000</p>
                        </div>
                        
                        <div className="flex justify-between mb-4 text-xs font-medium">
                            <div>
                                <p>Bill No: {selectedBill['Bill No.']}</p>
                                <p>Date: {selectedBill.date}</p>
                            </div>
                            <div className="text-right max-w-[120px]">
                                <p className="truncate">Cust: {selectedBill['Customer Name']}</p>
                            </div>
                        </div>

                        <table className="w-full mb-4 border-b border-dashed border-gray-400 pb-4 text-xs font-medium">
                            <thead>
                                <tr className="border-y border-dashed border-gray-400">
                                    <th className="text-left py-1.5 font-bold">Item</th>
                                    <th className="text-right py-1.5 font-bold">Qty</th>
                                    <th className="text-right py-1.5 font-bold">Rate</th>
                                    <th className="text-right py-1.5 font-bold">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billDetails.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="py-1 truncate pr-2">{item.name}</td>
                                        <td className="text-right py-1">{item.qty}</td>
                                        <td className="text-right py-1">{item.rate.toFixed(2)}</td>
                                        <td className="text-right py-1">{item.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex flex-col gap-1 text-xs mb-4 border-b border-dashed border-gray-400 pb-4 font-medium">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{billDetails.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>CGST @ 2.5%</span>
                                <span>{billDetails.cgst.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>SGST @ 2.5%</span>
                                <span>{billDetails.sgst.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-dashed border-gray-200">
                                <span>Grand Total</span>
                                <span>₹{billDetails.grandTotal}</span>
                            </div>
                        </div>
                        
                        <div className="text-center font-bold tracking-widest text-lg mt-6">PORTFOLIO</div>
                        <div className="text-center text-xs mt-1 text-gray-500 font-medium">Thank you for your visit!</div>
                </ModalShell>
            )}
        </div>
    );
};

export default Reports;
