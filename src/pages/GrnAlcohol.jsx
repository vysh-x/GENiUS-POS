import React, { useState } from 'react';
import { elements } from '../theme/elements';
import { ModalShell, PageHeader } from '../components/ui';
import { useNotification } from '../context/NotificationContext';
import { getUnifiedCatalog } from '../utils/catalogUtils';
import Swal from '../utils/tempSwal.jsx';
import {
    Search,
    Calendar,
    ArrowLeft,
    Save,
    Trash2,
    RefreshCw,
    FileText,
    CheckCircle2,
    AlertCircle,
    Beer,
    Loader2,
    History
} from 'lucide-react';

const staticIndents = ['IND-2026-001', 'IND-2026-002', 'IND-2026-003'];

const dummyGrnHistory = [
    { docid: 'GRN-2026-1001', date: '2026-06-01', invno: 'INV-A01', indno: 'IND-2026-001', tnamt: 45000, userName: 'admin' },
    { docid: 'GRN-2026-1002', date: '2026-06-02', invno: 'INV-A02', indno: 'IND-2026-002', tnamt: 22500, userName: 'store' },
    { docid: 'GRN-2026-1003', date: '2026-06-03', invno: 'INV-A03', indno: 'IND-2026-003', tnamt: 68000, userName: 'admin' }
];

const GrnAlcohol = () => {
    const { notification } = useNotification();

    const [viewMode, setViewMode] = useState('create');
    const [loading, setLoading] = useState(false);

    // Create Mode State
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [selectedIndent, setSelectedIndent] = useState('');
    const [indentItems, setIndentItems] = useState([]);
    const [totals, setTotals] = useState({ aroed: '', tcs: '', gross: '0.00', net: '' });

    // Manage Mode State
    const [historyFilters, setHistoryFilters] = useState({
        useDate: true, useGrn: false, fromDate: new Date().toISOString().split('T')[0], toDate: new Date().toISOString().split('T')[0], grnNo: ''
    });
    const [grnHistory, setGrnHistory] = useState([]);

    // Price Update Modal
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [priceUpdateData, setPriceUpdateData] = useState(null);

    const handleIndentChange = (indno) => {
        setSelectedIndent(indno);
        if (!indno) {
            setIndentItems([]);
            setTotals({ aroed: '', tcs: '', gross: '0.00', net: '' });
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const catalog = getUnifiedCatalog().filter(item => item.division === 'ALC');
            const generatedItems = [];
            const itemCount = Math.floor(Math.random() * 3) + 2; // 2 to 4 items
            for (let i = 0; i < itemCount; i++) {
                const randomItem = catalog[Math.floor(Math.random() * catalog.length)];
                if (randomItem) {
                    const price = parseFloat(randomItem.mrp) || 120;
                    const isMapped = Math.random() > 0.3; // 70% chance to be mapped
                    generatedItems.push({
                        kmatdesc: randomItem.name,
                        cnfcb: Math.floor(Math.random() * 20) + 1,
                        cnfcbtl: 0,
                        cnfamt: (Math.floor(Math.random() * 20) + 1) * 12 * price,
                        kbpc: 12,
                        astatus: isMapped ? 'C' : 'P',
                        marl_pprice: price * 0.8,
                        marl_mrp: price,
                        matdesc: isMapped ? `${randomItem.name} ${randomItem.packType || '750ML'}` : null,
                        originalItem: randomItem
                    });
                }
            }

            setIndentItems(generatedItems);
            const grossTotal = generatedItems.reduce((sum, item) => sum + (parseFloat(item.cnfamt) || 0), 0);
            setTotals({
                gross: grossTotal.toFixed(2),
                aroed: (grossTotal * 0.05).toFixed(2),
                tcs: (grossTotal * 0.01).toFixed(2),
                net: (grossTotal * 1.06).toFixed(2)
            });
            setLoading(false);
        }, 600);
    };

    const handleSaveGrn = async () => {
        if (!invoiceNo) return notification("Please enter an invoice number", "error");

        const confirm = await Swal.fire({
            title: 'Confirm Save?',
            text: 'Once saved, GRN cannot be modified.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Save GRN'
        });

        if (confirm.isConfirmed) {
            setLoading(true);
            setTimeout(() => {
                notification("GRN Saved successfully", "success");
                setSelectedIndent('');
                setIndentItems([]);
                setInvoiceNo('');
                setTotals({ aroed: '', tcs: '', gross: '0.00', net: '' });
                setLoading(false);
            }, 1000);
        }
    };

    const fetchHistory = () => {
        setLoading(true);
        setTimeout(() => {
            setGrnHistory(dummyGrnHistory);
            setLoading(false);
        }, 800);
    };

    const handleDeleteGrn = async (docid) => {
        const confirm = await Swal.fire({
            title: 'Delete GRN?',
            text: `Are you sure you want to delete ${docid}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete'
        });

        if (confirm.isConfirmed) {
            setLoading(true);
            setTimeout(() => {
                setGrnHistory(grnHistory.filter(h => h.docid !== docid));
                notification("GRN Deleted successfully", "success");
                setLoading(false);
            }, 600);
        }
    };

    const openPriceUpdate = (item, idx) => {
        const qty = parseInt(item.cnfcb || 0) * parseInt(item.kbpc || 0) + parseInt(item.cnfcbtl || 0);
        const cprice = qty === 0 ? 0 : (parseFloat(item.cnfamt) || 0) / qty;
        
        setPriceUpdateData({
            item, index: idx,
            prices: {
                oldPrice: item.marl_pprice,
                oldMrp: item.marl_mrp,
                cprice: cprice.toFixed(2),
                newMrp: ''
            }
        });
        setShowPriceModal(true);
    };

    const handleUpdatePrice = () => {
        if (!priceUpdateData.prices.newMrp) return notification("Please fill the MRP", "error");
        
        setLoading(true);
        setTimeout(() => {
            notification("Price updated successfully", "success");
            setShowPriceModal(false);
            setLoading(false);
        }, 500);
    };

    const requestMapping = () => {
        setLoading(true);
        setTimeout(() => {
            notification("Mapping request sent successfully", "success");
            setLoading(false);
        }, 800);
    };

    return (
        <div className={elements.pageContainer}>
            <PageHeader
                icon={Beer}
                title="GRN Alcohol"
                subtitle="Manage alcohol goods receipt notes"
                iconClassName="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-600/30"
                actions={(
                    <div className="flex items-center gap-2 mt-4 md:mt-0 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <button
                            onClick={() => setViewMode('create')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'create' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            Create GRN
                        </button>
                        <button
                            onClick={() => {
                                setViewMode('manage');
                                if (grnHistory.length === 0) fetchHistory();
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'manage' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            Manage
                        </button>
                    </div>
                )}
            />

            {viewMode === 'create' ? (
                <div className="space-y-6">
                    <div className={`${elements.card} p-6`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        value={invoiceDate}
                                        onChange={(e) => setInvoiceDate(e.target.value)}
                                        className={`${elements.input} pl-10`}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">KSBCL Invoice Number</label>
                                <input
                                    type="text"
                                    value={invoiceNo}
                                    onChange={(e) => setInvoiceNo(e.target.value)}
                                    placeholder="Enter invoice number"
                                    className={elements.input}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Select Indent</label>
                                <select
                                    value={selectedIndent}
                                    onChange={(e) => handleIndentChange(e.target.value)}
                                    className={elements.input}
                                >
                                    <option value="">Select an indent</option>
                                    {staticIndents.map((ind, idx) => (
                                        <option key={idx} value={ind}>{ind}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {selectedIndent && (
                        <div className={`${elements.card} overflow-hidden`}>
                            {loading ? (
                                <div className="flex flex-col items-center justify-center p-20">
                                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                                    <p className="font-medium text-gray-500">Loading indent details...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-gray-50/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700/50">
                                                <tr>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">S.No</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Name</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cases</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Gross Value</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800/50">
                                                {indentItems.map((item, idx) => {
                                                    const qty = parseInt(item.cnfcb || 0) * parseInt(item.kbpc || 0) + parseInt(item.cnfcbtl || 0);
                                                    const cprice = qty === 0 ? 0 : (parseFloat(item.cnfamt) || 0) / qty;
                                                    const priceDiff = Math.abs((parseFloat(item.marl_pprice) || 0) - cprice);
                                                    const showPriceBtn = priceDiff > 0;

                                                    return (
                                                        <tr key={idx} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">{idx + 1}</td>
                                                            <td className="px-6 py-4">
                                                                <div className="font-bold text-gray-900 dark:text-white">{item.matdesc || <span className="text-red-500">Unmapped</span>}</div>
                                                                <div className="text-xs text-gray-500 mt-1">{item.kmatdesc}</div>
                                                            </td>
                                                            <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                                                                {item.cnfcb} <span className="text-xs text-gray-400">({qty} btls)</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                                                                ₹{parseFloat(item.cnfamt).toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                {item.astatus === 'P' ? (
                                                                    <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-lg text-xs font-bold uppercase">Map</span>
                                                                ) : showPriceBtn ? (
                                                                    <button
                                                                        onClick={() => openPriceUpdate(item, idx)}
                                                                        className="px-3 py-1.5 bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 rounded-lg text-xs font-bold hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors"
                                                                    >
                                                                        PRICE
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-gray-400">-</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {indentItems.some(i => i.astatus === 'P') && (
                                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-900/50 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium">
                                                <AlertCircle size={18} />
                                                <span>Some items require mapping before saving this GRN.</span>
                                            </div>
                                            <button
                                                onClick={requestMapping}
                                                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold transition-colors"
                                            >
                                                Request Mapping
                                            </button>
                                        </div>
                                    )}

                                    <div className="p-6 bg-gray-50/80 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700/50">
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total AROED</label>
                                                <input type="number" value={totals.aroed} onChange={(e) => setTotals(prev => ({ ...prev, aroed: e.target.value }))} className={elements.input} placeholder="0.00" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">TCS Value</label>
                                                <input type="number" value={totals.tcs} onChange={(e) => setTotals(prev => ({ ...prev, tcs: e.target.value }))} className={elements.input} placeholder="0.00" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Net Invoice Value</label>
                                                <input type="number" value={totals.net} onChange={(e) => setTotals(prev => ({ ...prev, net: e.target.value }))} className={elements.input} placeholder="0.00" />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <div className="text-right">
                                                    <span className="text-xs font-bold text-gray-500 uppercase">Gross Total: </span>
                                                    <span className="text-xl font-black text-gray-900 dark:text-white">₹{parseFloat(totals.gross).toLocaleString()}</span>
                                                </div>
                                                <button
                                                    onClick={handleSaveGrn}
                                                    disabled={indentItems.some(i => i.astatus === 'P')}
                                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                                >
                                                    <Save size={18} />
                                                    SAVE GRN
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className={`${elements.card} p-6`}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={historyFilters.useDate} onChange={() => setHistoryFilters(prev => ({ ...prev, useDate: !prev.useDate, useGrn: prev.useDate }))} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Date Range</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="date" value={historyFilters.fromDate} onChange={(e) => setHistoryFilters(prev => ({ ...prev, fromDate: e.target.value }))} disabled={!historyFilters.useDate} className={`${elements.input} px-3 py-2 text-sm disabled:opacity-50`} />
                                    <input type="date" value={historyFilters.toDate} onChange={(e) => setHistoryFilters(prev => ({ ...prev, toDate: e.target.value }))} disabled={!historyFilters.useDate} className={`${elements.input} px-3 py-2 text-sm disabled:opacity-50`} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={historyFilters.useGrn} onChange={() => setHistoryFilters(prev => ({ ...prev, useGrn: !prev.useGrn, useDate: prev.useGrn }))} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">GRN Number</span>
                                </div>
                                <input type="text" placeholder="Enter GRN #" value={historyFilters.grnNo} onChange={(e) => setHistoryFilters(prev => ({ ...prev, grnNo: e.target.value }))} disabled={!historyFilters.useGrn} className={`${elements.input} disabled:opacity-50`} />
                            </div>
                            <button onClick={fetchHistory} className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                                Search
                            </button>
                        </div>
                    </div>

                    <div className={`${elements.card} overflow-hidden`}>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-20">
                                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                                <p className="font-medium text-gray-500">Loading history...</p>
                            </div>
                        ) : grnHistory.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-20 text-gray-500">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                    <History size={32} className="text-gray-300 dark:text-gray-600" />
                                </div>
                                <p className="font-bold text-gray-900 dark:text-white">No GRN History Found</p>
                                <p className="text-sm mt-1">Try adjusting your search filters.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">GRN Document ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice No</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Indent No</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Net Amount</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800/50">
                                    {grnHistory.map((grn, idx) => (
                                        <tr key={idx} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{grn.docid}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{grn.date}</td>
                                            <td className="px-6 py-4 text-sm font-medium">{grn.invno}</td>
                                            <td className="px-6 py-4 text-sm font-medium">{grn.indno}</td>
                                            <td className="px-6 py-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                                                ₹{parseFloat(grn.tnamt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleDeleteGrn(grn.docid)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all active:scale-95"
                                                    title="Delete GRN"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* Price Update Modal */}
            {showPriceModal && priceUpdateData && (
                <ModalShell
                    overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                    panelClassName="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                >
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Update MRP</h3>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-6 truncate">{priceUpdateData.item.matdesc}</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cost Price</label>
                                    <input type="text" value={priceUpdateData.prices.cprice} disabled className={`${elements.input} bg-gray-50 dark:bg-gray-900 opacity-70`} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current MRP</label>
                                    <input type="text" value={priceUpdateData.prices.oldMrp} disabled className={`${elements.input} bg-gray-50 dark:bg-gray-900 opacity-70`} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">New MRP</label>
                                    <input 
                                        type="number" 
                                        value={priceUpdateData.prices.newMrp}
                                        onChange={(e) => setPriceUpdateData(prev => ({...prev, prices: {...prev.prices, newMrp: e.target.value}}))}
                                        className={elements.input}
                                        placeholder="Enter new MRP"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
                            <button onClick={() => setShowPriceModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleUpdatePrice} disabled={loading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Update
                            </button>
                        </div>
                </ModalShell>
            )}
        </div>
    );
};

export default GrnAlcohol;
