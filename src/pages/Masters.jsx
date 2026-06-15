import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { elements } from '../theme/elements';
import { useNotification } from '../context/NotificationContext';
import { ModalShell } from '../components/ui';
import {
    Database, Plus, RefreshCw, Upload, Search, Edit2, Trash2,
    ChevronDown, ChevronLeft, ChevronRight, X, Check, AlertCircle, CheckCircle, Loader2,
    Tag, Package, Layers, BarChart2, Star, Hash, BookOpen,
    FileText, ShoppingCart, Percent, Gift, ArrowRight, Barcode,
    ToggleLeft, ToggleRight, Settings
} from 'lucide-react';
import { mockCatalog } from '../data/mockCatalog';
import { getUnifiedCatalog, getUnifiedCategories, getUnifiedSubcategories } from '../utils/catalogUtils';

const SUB_MODULES = [
    { key: 'categ', label: 'Category', table: 'categ', icon: Tag },
    { key: 'scateg', label: 'Subcategory', table: 'scateg', icon: Layers },
    { key: 'brand', label: 'Brand', table: 'brand', icon: Star },
    { key: 'pktype', label: 'Packtype', table: 'pktype', icon: Package },
    { key: 'pksize', label: 'Packsize', table: 'pksize', icon: BarChart2 },
    { key: 'hsnmas', label: 'HSNSAC Codes', table: 'hsnmas', icon: Hash },
    { key: 'mara', label: 'Material Master', table: 'mara', icon: Database },
    { key: 'price', label: 'Price List', table: 'price', icon: ShoppingCart },
    { key: 'ctype', label: 'Calculation Types', table: 'ctype', icon: Percent },
    { key: 'disctype', label: 'Discount Types', table: 'disctype', icon: Percent },
    { key: 'offers', label: 'Offers', table: 'offers', icon: Gift },
];

const TABLE_COLS = {
    categ: [{ label: 'Division', key: 'division' }, { label: 'Category', key: 'categ' }, { label: 'Possession Limit', key: 'pplimit' }, { label: 'Active', key: 'active' }],
    scateg: [{ label: 'Category', key: 'categ' }, { label: 'SubCategory', key: 'scateg' }, { label: 'Active', key: 'active' }],
    brand: [{ label: 'Category', key: 'categ' }, { label: 'SubCategory', key: 'scateg' }, { label: 'Brand Name', key: 'bname' }, { label: 'Brand Owner', key: 'bowner' }, { label: 'Active', key: 'active' }],
    pktype: [{ label: 'Packtype', key: 'pktype' }, { label: 'Active', key: 'active' }],
    pksize: [{ label: 'Packsize', key: 'pksize' }, { label: 'Active', key: 'active' }],
    hsnmas: [{ label: 'HSN Code', key: 'hsncode' }, { label: 'Tax %', key: 'rate' }, { label: 'Active', key: 'active' }],
    mara: [{ label: 'SubCategory', key: 'scateg' }, { label: 'Pack Type', key: 'pktype' }, { label: 'Pack Size', key: 'pksize' }, { label: 'Material Desc', key: 'matdesc' }, { label: 'Barcode', key: 'barcode' }, { label: 'Active', key: 'active' }],
    price: [{ label: 'SubCategory', key: 'scateg' }, { label: 'Material Name', key: 'matdesc' }, { label: 'Price', key: 'pprice' }, { label: 'MRP', key: 'mrp' }, { label: 'Active', key: 'active' }],
    ctype: [{ label: 'Calculation Type', key: 'calctype' }, { label: 'Active', key: 'active' }],
    disctype: [{ label: 'Discount Type', key: 'disctype' }, { label: 'Active', key: 'active' }],
    offers: [{ label: 'Offer', key: 'offer' }, { label: 'Material', key: 'matdesc' }, { label: 'Disc Type', key: 'disctype' }, { label: 'Disc Value', key: 'discval' }, { label: 'Active', key: 'active' }],
};

const DROPDOWN_OPTIONS = {
    division: mockCatalog.divisions,
    categ: [...new Set(mockCatalog.categories.map(c => c.name))],
    scateg: [...new Set(mockCatalog.subcategories.map(s => s.scateg))],
    pktype: mockCatalog.packTypes.map(p => p.pktype),
    pksize: mockCatalog.packSizes.map(p => p.pksize),
    calctype: mockCatalog.calcTypes.map(c => c.calctype),
    disctype: mockCatalog.discTypes.map(d => d.disctype),
};

const getDropdownOptions = (colKey, formData) => {
    if (colKey === 'categ') {
        return [...new Set(getUnifiedCategories().map(c => c.name))];
    }
    if (colKey === 'scateg' && formData.categ) {
        return [...new Set(getUnifiedSubcategories().filter(s => s.categ === formData.categ).map(s => s.scateg))];
    }
    if (colKey === 'scateg') {
        return [...new Set(getUnifiedSubcategories().map(s => s.scateg))];
    }
    return DROPDOWN_OPTIONS[colKey] || [];
};

const generateMockData = (tab) => {
    switch(tab) {
        case 'categ':
            return mockCatalog.categories.map((c, i) => ({
                id: i, division: c.division, categ: c.name, pplimit: '10', active: 'Y'
            }));
        case 'scateg':
            return mockCatalog.subcategories.map((s, i) => ({
                id: i, categ: s.categ, scateg: s.scateg, active: 'Y'
            }));
        case 'brand':
            return mockCatalog.brands;
        case 'pktype':
            return mockCatalog.packTypes;
        case 'pksize':
            return mockCatalog.packSizes;
        case 'hsnmas':
            return mockCatalog.hsnCodes;
        case 'mara':
            return getUnifiedCatalog().map((it) => ({
                id: it.id, scateg: it.subcategory, pktype: it.name.includes('CAN') ? 'CAN' : 'BTL', pksize: it.name.includes('330') ? '330ML' : '750ML', matdesc: it.name, barcode: '890' + Math.floor(Math.random() * 1000000000), active: it.active || 'Y'
            }));
        case 'price':
            return getUnifiedCatalog().map((it) => ({
                id: it.id, scateg: it.subcategory, matdesc: it.name, pprice: (it.mrp * 0.8).toFixed(2), mrp: it.mrp, active: it.active || 'Y'
            }));
        case 'ctype':
            return mockCatalog.calcTypes;
        case 'disctype':
            return mockCatalog.discTypes;
        case 'offers':
            return mockCatalog.offers;
        default:
            return [];
    }
};

const Masters = () => {
    const { user, actionPermissions } = useAuth();
    const notify = useNotification();
    const [activeTab, setActiveTab] = useState('categ');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [localData, setLocalData] = useState([]);
    const [deletedIds, setDeletedIds] = useState([]);

    const currentUserType = user?.type || user?.role || 'admin';
    const canToggleActive = actionPermissions[currentUserType]?.masters_allow_active !== false;
    const canEditDelete = actionPermissions[currentUserType]?.masters_allow_edit_delete !== false;

    const activeModInfo = SUB_MODULES.find(m => m.key === activeTab) || SUB_MODULES[0];
    const columns = TABLE_COLS[activeTab] || [];
    
    // Reset page to 1 when tab or search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm]);

    React.useEffect(() => {
        setShowModal(false);
        setIsEditMode(false);
        setFormData({});
    }, [activeTab]);

    React.useEffect(() => {
        const storedLocal = localStorage.getItem(`masters_${activeTab}_local`);
        const storedDeleted = localStorage.getItem(`masters_${activeTab}_deleted`);
        try { setLocalData(storedLocal ? JSON.parse(storedLocal) : []); } catch { setLocalData([]); }
        try { setDeletedIds(storedDeleted ? JSON.parse(storedDeleted) : []); } catch { setDeletedIds([]); }
    }, [activeTab]);

    const rawData = useMemo(() => {
        const generated = generateMockData(activeTab);
        let base = generated.filter(item => !deletedIds.includes(item.id));
        base = base.map(item => {
            const override = localData.find(l => l.id === item.id);
            return override ? override : item;
        });
        const newlyAdded = localData.filter(l => String(l.id).startsWith('LOCAL-') && !deletedIds.includes(l.id) && !base.some(b => b.id === l.id));
        return [...base, ...newlyAdded];
    }, [activeTab, localData, deletedIds]);
    
    const filteredData = useMemo(() => {
        if (!searchTerm) return rawData;
        const lower = searchTerm.toLowerCase();
        return rawData.filter(row => 
            Object.values(row).some(val => String(val).toLowerCase().includes(lower))
        );
    }, [rawData, searchTerm]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <>
            <div className="flex flex-col md:flex-row h-full">
            {/* Left Sidebar */}
            <div className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700/50">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Sub Modules</h3>
                    </div>
                    <div className="p-2 space-y-1">
                        {SUB_MODULES.map((mod) => (
                            <button
                                key={mod.key}
                                onClick={() => {
                                    setActiveTab(mod.key);
                                    setSearchTerm('');
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    activeTab === mod.key
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <mod.icon size={18} />
                                <div className="flex-1 text-left">{mod.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-900">
                    <div className="p-6 lg:p-8 flex-1 overflow-y-auto">
                        
                        {/* Header Actions */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
                                    <activeModInfo.icon size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeModInfo.label}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage and monitor {activeModInfo.label.toLowerCase()} entries globally.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => {
                                    notify.notification('Upload CSV dialog opened.', 'success');
                                }} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
                                    <Upload size={16} />
                                    Upload CSV
                                </button>
                                <button onClick={() => {
                                    setFormData({});
                                    setIsEditMode(false);
                                    setShowModal(true);
                                }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                                    <Plus size={16} />
                                    Add New
                                </button>
                            </div>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={`Search ${activeModInfo.label}...`}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                Showing {filteredData.length} records
                            </div>
                        </div>

                        {/* Table Area */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                            {columns.map((col, idx) => (
                                                <th key={idx} className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                                    {col.label}
                                                </th>
                                            ))}
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                        {paginatedData.length > 0 ? paginatedData.map((row) => (
                                            <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                                {columns.map((col, idx) => (
                                                    <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {col.key === 'active' ? (
                                                            <button 
                                                                onClick={() => {
                                                                    if (!canToggleActive) {
                                                                        notify.notification('You do not have permission to toggle active status.', 'error');
                                                                        return;
                                                                    }
                                                                    const updatedRow = { ...row, active: row.active === 'N' ? 'Y' : 'N' };
                                                                    let updatedLocal;
                                                                    const existsIndex = localData.findIndex(l => l.id === row.id);
                                                                    if (existsIndex >= 0) {
                                                                        updatedLocal = [...localData];
                                                                        updatedLocal[existsIndex] = updatedRow;
                                                                    } else {
                                                                        updatedLocal = [...localData, updatedRow];
                                                                    }
                                                                    localStorage.setItem(`masters_${activeTab}_local`, JSON.stringify(updatedLocal));
                                                                    setLocalData(updatedLocal);
                                                                    notify.notification(`${activeModInfo.label} status changed to ${updatedRow.active === 'Y' ? 'Active' : 'Inactive'}`, 'success');
                                                                }}
                                                                className={`inline-flex items-center justify-center min-w-[80px] px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${row.active === 'N' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'}`}
                                                            >
                                                                {row.active === 'N' ? 'Inactive' : 'Active'}
                                                            </button>
                                                        ) : col.key === 'matdesc' && activeTab === 'price' && (!row.mrp || row.mrp === '') ? (
                                                            <div className="flex items-center gap-2">
                                                                <span>{row[col.key] || '-'}</span>
                                                                <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 text-[10px] font-bold rounded uppercase border border-rose-200 dark:border-rose-800/50">Not Edited</span>
                                                            </div>
                                                        ) : (
                                                            row[col.key] || '-'
                                                        )}
                                                    </td>
                                                ))}
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {canEditDelete ? (
                                                        <>
                                                            <button onClick={() => {
                                                                setFormData(row);
                                                                setIsEditMode(true);
                                                                setShowModal(true);
                                                            }} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mx-2">
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button onClick={() => {
                                                                const updatedDeleted = [...deletedIds, row.id];
                                                                setDeletedIds(updatedDeleted);
                                                                localStorage.setItem(`masters_${activeTab}_deleted`, JSON.stringify(updatedDeleted));
                                                                notify.notification(`${activeModInfo.label} deleted successfully!`, 'success');
                                                            }} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400 dark:text-gray-600 italic text-xs">Restricted</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                                    No records found matching your search.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination Controls */}
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Rows per page:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 py-1 px-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Page <span className="font-medium text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-medium text-gray-900 dark:text-white">{totalPages || 1}</span>
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <ModalShell>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{isEditMode ? 'Edit' : 'Add New'} {activeModInfo.label}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            {columns.filter(c => c.key !== 'active').map(col => (
                                <div key={col.key} className={elements.inputWrapper}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{col.label}</label>
                                    {DROPDOWN_OPTIONS[col.key] && col.key !== activeTab && !(activeTab === 'ctype' && col.key === 'calctype') ? (
                                        <div className="relative">
                                            <select
                                                value={formData[col.key] || ''}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (col.key === 'categ') {
                                                        setFormData({ ...formData, categ: val, scateg: '' });
                                                    } else {
                                                        setFormData({ ...formData, [col.key]: val });
                                                    }
                                                }}
                                                className={elements.selectInput + " w-full"}
                                            >
                                                <option value="" disabled>Select {col.label}</option>
                                                {getDropdownOptions(col.key, formData).map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData[col.key] || ''}
                                            onChange={e => setFormData({ ...formData, [col.key]: e.target.value })}
                                            className={elements.input}
                                            placeholder={`Enter ${col.label}...`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">Cancel</button>
                            <button onClick={() => {
                                let updatedLocal;
                                if (isEditMode) {
                                    const existsIndex = localData.findIndex(l => l.id === formData.id);
                                    if (existsIndex >= 0) {
                                        updatedLocal = [...localData];
                                        updatedLocal[existsIndex] = formData;
                                    } else {
                                        updatedLocal = [...localData, formData];
                                    }
                                } else {
                                    const newRecord = { ...formData, id: 'LOCAL-' + Date.now(), active: 'Y' };
                                    updatedLocal = [...localData, newRecord];
                                }
                                localStorage.setItem(`masters_${activeTab}_local`, JSON.stringify(updatedLocal));
                                setLocalData(updatedLocal);
                                setShowModal(false);
                                notify.notification(`${activeModInfo.label} ${isEditMode ? 'updated' : 'added'} successfully!`, 'success');
                            }} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition">Save</button>
                        </div>
                </ModalShell>
            )}
        </>
    );
};

export default Masters;
