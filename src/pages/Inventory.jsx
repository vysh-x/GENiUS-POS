import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { elements } from '../theme/elements';
import { ModalShell, PageHeader } from '../components/ui';
import {
    Plus, Upload, Package, Search, Calendar, ArrowLeft, Save,
    FileText, RefreshCw, AlertCircle, ChevronRight, ArrowUpDown, X
} from 'lucide-react';

// MOCK DATA
const mockMovementTypes = [
    { txtype: '100', txdesc: 'Opening Stock' },
    { txtype: '101', txdesc: 'Stock In (Purchase)' },
    { txtype: '102', txdesc: 'Stock Out (Wastage)' },
    { txtype: '103', txdesc: 'Transfer Out' },
    { txtype: '104', txdesc: 'Transfer In' }
];

import { mockCatalog } from '../data/mockCatalog';

const mockMaterials = mockCatalog.items.map(item => ({
    matnr: item.id,
    matdesc: item.name,
    pprice: Math.floor(Math.random() * 150) + 10,
    curstock: Math.floor(Math.random() * 100) + 5,
    division: ['Beer', 'Whiskey', 'Rum', 'Vodka', 'Wine', 'Tequila', 'Brandy'].includes(item.category) ? 'ALC' : 'NALC'
}));

const mockStores = [
    { customerid: 'madurai', storename: 'Madurai Store' },
    { customerid: 'chennai', storename: 'Chennai Store' },
    { customerid: 'trichy', storename: 'Trichy Store' }
];

const initialMovements = [
    { docid: 'DOC-1001', division: 'NALC', txtype: '101', txdesc: 'Stock In (Purchase)', mtype: 'IN', crdt: '2026-06-03', remarks: 'Weekly Delivery', amount: 450.00 },
    { docid: 'DOC-1002', division: 'NALC', txtype: '102', txdesc: 'Stock Out (Wastage)', mtype: 'OUT', crdt: '2026-06-02', remarks: 'Spoiled juice batches', amount: 18.00 },
    { docid: 'DOC-1003', division: 'ALC', txtype: '103', txdesc: 'Transfer Out', mtype: 'TRF', crdt: '2026-06-01', remarks: 'Sent vodka to Chennai Store', amount: 125.00 },
    { docid: 'DOC-1004', division: 'NALC', txtype: '100', txdesc: 'Opening Stock', mtype: 'IN', crdt: '2026-05-30', remarks: 'Initial count for June', amount: 3200.00 },
    { docid: 'DOC-1005', division: 'NALC', txtype: '101', txdesc: 'Stock In (Purchase)', mtype: 'IN', crdt: '2026-05-28', remarks: 'Local farm produce', amount: 145.50 },
    { docid: 'DOC-1006', division: 'ALC', txtype: '101', txdesc: 'Stock In (Purchase)', mtype: 'IN', crdt: '2026-05-25', remarks: 'Beer kegs restock', amount: 1500.00 },
    { docid: 'DOC-1007', division: 'NALC', txtype: '102', txdesc: 'Stock Out (Wastage)', mtype: 'OUT', crdt: '2026-05-22', remarks: 'Dropped steak tray', amount: 60.00 },
    { docid: 'DOC-1008', division: 'NALC', txtype: '104', txdesc: 'Transfer In', mtype: 'TRF', crdt: '2026-05-20', remarks: 'Received snacks from Chennai Store', amount: 48.00 },
    { docid: 'DOC-1009', division: 'NALC', txtype: '101', txdesc: 'Stock In (Purchase)', mtype: 'IN', crdt: '2026-05-18', remarks: 'Water bulk delivery', amount: 225.00 },
    { docid: 'DOC-1010', division: 'NALC', txtype: '101', txdesc: 'Stock In (Purchase)', mtype: 'IN', crdt: '2026-05-15', remarks: 'Emergency soda restock', amount: 42.50 }
];

const Inventory = () => {
    const { user, actionPermissions } = useAuth();
    const { notification } = useNotification();

    const userRole = (user?.accesslevel || 'store').toLowerCase();
    const permissions = actionPermissions[userRole] || {};
    const canAddNewMovement = permissions.inventory_new_movement !== false;

    const [viewMode, setViewMode] = useState('list'); // 'list', 'create'
    const [movements, setMovements] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'crdt', direction: 'desc' });

    // Filter out current store from transfer destinations
    const transferStores = useMemo(() => {
        const rawId = user?.store?.customerid || user?.customerId || user?.shopId || user?.shop_id || 'madurai';
        const currentShopId = typeof rawId === 'string' ? rawId.toLowerCase() : 'madurai';
        return mockStores.filter(s => s.customerid.toLowerCase() !== currentShopId);
    }, [user]);

    // Save and load movements helper
    const saveMovements = (newMovements) => {
        setMovements(newMovements);
        localStorage.setItem('carture_mock_movements_v4', JSON.stringify(newMovements));
    };

    React.useEffect(() => {
        const saved = localStorage.getItem('carture_mock_movements_v4');
        if (saved) {
            setMovements(JSON.parse(saved));
        } else {
            saveMovements(initialMovements);
        }
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        txtype: '',
        date: new Date().toISOString().split('T')[0],
        division: '', // 'ALC' or 'NALC'
        matnr: '',
        invstore: '',
        qty: '',
        remarks: ''
    });

    // Derived Material info based on selection
    const selectedMaterial = useMemo(() => {
        return mockMaterials.find(m => m.matnr === formData.matnr) || null;
    }, [formData.matnr]);

    // Filter materials dropdown based on selected division
    const filteredMaterials = useMemo(() => {
        if (!formData.division) return mockMaterials;
        return mockMaterials.filter(m => m.division === formData.division);
    }, [formData.division]);

    const totalAmount = useMemo(() => {
        if (!selectedMaterial || !formData.qty) return '0.00';
        const qty = parseInt(formData.qty) || 0;
        return (qty * selectedMaterial.pprice).toFixed(2);
    }, [selectedMaterial, formData.qty]);

    // Grid Data Processing
    const filteredMovements = useMemo(() => {
        return movements.filter(m =>
            m.txdesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.docid.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (m.division && m.division.toLowerCase().includes(searchTerm.toLowerCase())) ||
            m.remarks.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [movements, searchTerm]);

    const sortedMovements = useMemo(() => {
        let sortable = [...filteredMovements];
        sortable.sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sortable;
    }, [filteredMovements, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const handleOpenCreate = () => {
        setViewMode('create');
        setFormData({
            txtype: '',
            date: new Date().toISOString().split('T')[0],
            division: '',
            matnr: '',
            invstore: '',
            qty: '',
            remarks: ''
        });
    };

    const handleBack = () => setViewMode('list');

    const handleSave = () => {
        if (!formData.txtype) return notification("Please select movement type", "error");
        if (!formData.division) return notification("Please select division (ALC/NALC)", "error");
        if (!formData.matnr) return notification("Please select material", "error");
        if (!formData.qty || parseInt(formData.qty) <= 0) return notification("Please enter a valid quantity", "error");
        
        if (['103', '104'].includes(formData.txtype) && !formData.invstore) {
            return notification("Please select a store for transfer", "error");
        }

        const typeDesc = mockMovementTypes.find(t => t.txtype === formData.txtype)?.txdesc || 'Unknown';
        const mtype = ['100', '101', '104'].includes(formData.txtype) ? 'IN' : 'OUT';

        const newMovement = {
            docid: `DOC-${1000 + movements.length + 1}`,
            division: formData.division,
            txtype: formData.txtype,
            txdesc: typeDesc,
            mtype: mtype,
            crdt: formData.date,
            remarks: formData.remarks || `${typeDesc} Entry`,
            amount: parseFloat(totalAmount)
        };

        saveMovements([newMovement, ...movements]);
        notification("Material Movement saved successfully!", "success");
        handleBack();
    };

    return (
        <div className={elements.pageContainer}>
            <PageHeader
                icon={Package}
                title="Material Movement"
                subtitle="Track and manage material movements"
                iconClassName="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-lg shadow-blue-600/30"
                actions={viewMode === 'list' ? (
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                        {canAddNewMovement && (
                            <button
                                onClick={handleOpenCreate}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium shadow-sm hover:shadow-md"
                            >
                                <Plus size={18} />
                                Add Movement
                            </button>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors mt-4 md:mt-0"
                    >
                        <ArrowLeft size={18} />
                        Back to List
                    </button>
                )}
            />

            {viewMode === 'list' && (
                <div className="space-y-4">
                    {/* Toolbar */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
                        <div className="relative w-full max-w-md">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by type, ID or remarks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow text-sm"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        {['docid', 'division', 'txdesc', 'mtype', 'crdt', 'amount', 'remarks'].map(key => {
                                            const labelMap = { docid: 'Doc ID', division: 'Division', txdesc: 'Movement', mtype: 'Type', crdt: 'Date', amount: 'Amount', remarks: 'Remarks' };
                                            return (
                                                <th 
                                                    key={key} 
                                                    onClick={() => requestSort(key)}
                                                    className="px-6 py-4 font-semibold uppercase tracking-wider text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-1">
                                                        {labelMap[key]}
                                                        <ArrowUpDown size={14} className={`text-gray-400 group-hover:text-blue-500 ${sortConfig.key === key ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                                                    </div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedMovements.length > 0 ? sortedMovements.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b border-gray-200 dark:border-gray-700/50 last:border-0">
                                            <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">{item.docid}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${item.division === 'ALC' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300'}`}>
                                                    {item.division || 'NALC'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">{item.txdesc}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.mtype === 'IN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : item.mtype === 'OUT' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                                                    {item.mtype}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(item.crdt).toLocaleDateString('en-GB')}</td>
                                            <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">₹{item.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-gray-500">{item.remarks}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Package size={32} className="text-gray-300 mb-2" />
                                                    <p>No material movements found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'create' && (
                <ModalShell panelClassName={`${elements.modalWrapper} max-w-xl w-full flex flex-col mx-4 animate-in fade-in zoom-in-95 duration-200`}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-150 dark:border-gray-700/50">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                <Plus size={20} className="text-blue-600" />
                                New Material Movement
                            </h2>
                            <button 
                                onClick={handleBack} 
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Form Content */}
                        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
                            {/* Row 1: Type and Date */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Movement Type</label>
                                    <select
                                        value={formData.txtype}
                                        onChange={(e) => setFormData(prev => ({ ...prev, txtype: e.target.value, matnr: '', qty: '' }))}
                                        className={`${elements.selectInput} w-full`}
                                    >
                                        <option value="">Select Movement Type</option>
                                        {mockMovementTypes.map(t => (
                                            <option key={t.txtype} value={t.txtype}>{t.txdesc}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Division & Material Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Division</label>
                                    <select
                                        value={formData.division}
                                        onChange={(e) => setFormData(prev => ({ ...prev, division: e.target.value, matnr: '' }))}
                                        className={`${elements.selectInput} w-full`}
                                    >
                                        <option value="">Select Division</option>
                                        <option value="ALC">ALC (Alcohol)</option>
                                        <option value="NALC">NALC (Non-Alcohol)</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Material Name</label>
                                    <select
                                        value={formData.matnr}
                                        onChange={(e) => setFormData(prev => ({ ...prev, matnr: e.target.value }))}
                                        className={`${elements.selectInput} w-full`}
                                    >
                                        <option value="">Select Material</option>
                                        {filteredMaterials.map(m => (
                                            <option key={m.matnr} value={m.matnr}>{m.matdesc}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row 2.5: Store Name (if Transfer) */}
                            {['103', '104'].includes(formData.txtype) && (
                                <div className="space-y-1 animate-in fade-in duration-200">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Store Name</label>
                                    <select
                                        value={formData.invstore}
                                        onChange={(e) => setFormData(prev => ({ ...prev, invstore: e.target.value }))}
                                        className={`${elements.selectInput} w-full`}
                                    >
                                        <option value="">Select Store</option>
                                        {transferStores.map(s => (
                                            <option key={s.customerid} value={s.customerid}>{s.storename}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Row 3: Quantity & Book Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.qty}
                                        onChange={(e) => setFormData(prev => ({ ...prev, qty: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-center"
                                        placeholder="0"
                                        min="1"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Book Stock</label>
                                    <div className="w-full px-4 py-2.5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-300 font-bold text-base text-center flex items-center justify-center h-[42px]">
                                        {selectedMaterial ? selectedMaterial.curstock : '--'}
                                    </div>
                                </div>
                            </div>

                            {/* Row 4: Purchase Price & Total Amount Display Card */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-150 dark:border-gray-800">
                                <div className="text-center border-r border-gray-200 dark:border-gray-700">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Purchase Price</span>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-base">
                                        {selectedMaterial ? `₹${selectedMaterial.pprice.toFixed(2)}` : '₹0.00'}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Amount</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">₹{totalAmount}</span>
                                </div>
                            </div>

                            {/* Row 5: Remarks */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Remarks / Comment</label>
                                <textarea
                                    value={formData.remarks}
                                    onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                                    rows="3"
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all text-sm"
                                    placeholder="Add any internal remarks here..."
                                />
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-150 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
                            <button
                                onClick={handleBack}
                                className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-gray-300 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all text-sm"
                            >
                                <Save size={16} />
                                Save Entry
                            </button>
                        </div>
                </ModalShell>
            )}
        </div>
    );
};

export default Inventory;
