import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { elements } from '../theme/elements';
import { ModalShell, PageHeader } from '../components/ui';
import { DollarSign, Save, Printer, Trash2, Calendar, Plus, X } from 'lucide-react';
import Swal from '../utils/tempSwal';

const StoreExpense = () => {
    const { user, actionPermissions } = useAuth();
    const { notification } = useNotification();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
    const userRole = (user?.accesslevel || 'store').toLowerCase();
    const permissions = actionPermissions[userRole] || {};
    const canAddFields = permissions.expense_add_fields === true;

    // Custom Fields State
    const [customFields, setCustomFields] = useState([]);
    
    useEffect(() => {
        const saved = localStorage.getItem('carture_custom_expense_fields');
        if (saved) {
            try {
                setCustomFields(JSON.parse(saved));
            } catch {
                setCustomFields([]);
            }
        }
    }, []);

    const saveCustomFields = (fields) => {
        setCustomFields(fields);
        localStorage.setItem('carture_custom_expense_fields', JSON.stringify(fields));
    };

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFieldData, setNewFieldData] = useState({
        category: 'Expenses',
        label: '',
        type: 'number'
    });

    const handleAddField = () => {
        if (!newFieldData.label.trim()) {
            return notification('Please enter a field name', 'error');
        }
        
        const newField = {
            key: `custom_${Date.now()}`,
            label: newFieldData.label.trim(),
            category: newFieldData.category,
            type: newFieldData.type
        };
        
        const updated = [...customFields, newField];
        saveCustomFields(updated);
        
        // Initialize form data for new field
        setFormData(prev => ({
            ...prev,
            [newField.key]: ''
        }));
        
        setShowAddModal(false);
        setNewFieldData({ category: 'Expenses', label: '', type: 'number' });
        notification('Custom field added successfully', 'success');
    };

    // Static State with Persistence
    const getInitialFormData = () => {
        const draft = localStorage.getItem('carture_expense_draft');
        if (draft) {
            try {
                return JSON.parse(draft);
            } catch {
                localStorage.removeItem('carture_expense_draft');
            }
        }
        return {
            opcash: '', cashra: '',
            salesmrp: '', rsales: '', lrev: '',
            ksbclpur: '', nalcpur: '',
            stockin: '', stockout: '',
            exptotal: '',
            card1: '', card2: '', card3: '', upi1: '', upi2: '', upi3: '', cash1: '',
            bnkdep: '', rk: '', tcashamt: '', scashamt: '', diffamt: ''
        };
    };

    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        localStorage.setItem('carture_expense_draft', JSON.stringify(formData));
    }, [formData]);

    // When custom fields load, ensure they are in formData
    useEffect(() => {
        if (customFields.length > 0) {
            setFormData(prev => {
                const updated = { ...prev };
                let changed = false;
                customFields.forEach(f => {
                    if (updated[f.key] === undefined) {
                        updated[f.key] = '';
                        changed = true;
                    }
                });
                return changed ? updated : prev;
            });
        }
    }, [customFields]);

    const handleFieldChange = (e, type = 'number') => {
        const { name, value } = e.target;
        if (type === 'number') {
            const cleaned = value.replace(/[^0-9.]/g, '');
            setFormData(prev => ({ ...prev, [name]: cleaned }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        const result = await Swal.fire({
            title: 'Please confirm or save after close of business',
            text: 'Once saved data cannot be changed',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, save it!'
        });
        if (result.isConfirmed) {
            notification("Store Expense saved successfully!", "success");
            const resetData = {};
            Object.keys(formData).forEach(k => resetData[k] = '');
            setFormData(resetData);
            localStorage.removeItem('carture_expense_draft');
        }
    };

    const handlePrint = () => {
        notification("Print initiated.", "success");
        window.print();
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this expense entry?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            notification("Deleted successfully", "success");
            const resetData = {};
            Object.keys(formData).forEach(k => {
                resetData[k] = '';
            });
            setFormData(resetData);
        }
    };

    const renderInputGroup = (title, defaultFields) => {
        // Merge custom fields for this category
        const categoryCustomFields = customFields.filter(f => f.category === title);
        const allFields = [...defaultFields, ...categoryCustomFields];
        
        return (
            <div className={elements.card}>
                <div className={elements.cardHeader}>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
                </div>
                <div className={`${elements.cardBody} grid grid-cols-1 md:grid-cols-2 gap-6`}>
                    {allFields.map(f => {
                        const isNum = f.type ? f.type === 'number' : true; // default fields don't have type specified, they are all numbers
                        return (
                            <div key={f.key} className="flex flex-col gap-2 relative group">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
                                    {f.label}
                                    {canAddFields && f.key.startsWith('custom_') && (
                                        <button 
                                            onClick={() => {
                                                const updated = customFields.filter(c => c.key !== f.key);
                                                saveCustomFields(updated);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                                            title="Remove Field"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </label>
                                <input
                                    type={isNum ? "text" : "text"}
                                    name={f.key}
                                    value={formData[f.key] || ''}
                                    onChange={(e) => handleFieldChange(e, isNum ? 'number' : 'text')}
                                    className={`${elements.input} ${isNum ? 'text-right' : 'text-left'}`}
                                    placeholder={isNum ? "0.00" : "Enter text..."}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={elements.pageContainer}>
            <PageHeader
                icon={DollarSign}
                title="Store Expense"
                subtitle="Track and manage your daily store expenses and settlements."
                iconClassName="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-600/30"
                actions={(
                    <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
                        {canAddFields && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 rounded-xl transition-colors text-sm font-medium shadow-sm"
                        >
                            <Plus size={18} />
                            Add Field
                        </button>
                        )}
                        <div className="relative ml-2">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className={`${elements.input} pl-10 py-2.5 !w-auto`}
                        />
                        </div>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium shadow-sm"
                        >
                            <Save size={18} />
                            Save
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-xl transition-colors text-sm font-medium shadow-sm"
                        >
                            <Printer size={18} />
                            Print
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl transition-colors text-sm font-medium shadow-sm"
                        >
                            <Trash2 size={18} />
                            Delete
                        </button>
                    </div>
                )}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderInputGroup('Opening', [{ key: 'opcash', label: 'Opening Cash' }, { key: 'cashra', label: 'Cash Raised' }])}
                {renderInputGroup('Sales', [{ key: 'salesmrp', label: 'Sales @ MRP' }, { key: 'rsales', label: 'Restaurant Sales' }, { key: 'lrev', label: 'Lodge Revenue' }])}
                {renderInputGroup('Purchase', [{ key: 'ksbclpur', label: 'Alcohol Purchase' }, { key: 'nalcpur', label: 'Non Alcohol Purchase' }])}
                {renderInputGroup('Transfers', [{ key: 'stockin', label: 'Transfer IN' }, { key: 'stockout', label: 'Transfer OUT' }])}
                {renderInputGroup('Expenses', [{ key: 'exptotal', label: 'Total Expenses' }])}
                {renderInputGroup('Receipt by', [
                    { key: 'card1', label: 'Card 1' }, { key: 'card2', label: 'Card 2' }, { key: 'card3', label: 'Card 3' },
                    { key: 'upi1', label: 'UPI 1' }, { key: 'upi2', label: 'UPI 2' }, { key: 'upi3', label: 'UPI 3' }, { key: 'cash1', label: 'Cash' }
                ])}
                <div className="lg:col-span-2">
                    {renderInputGroup('Overall Summary', [
                        { key: 'bnkdep', label: 'Bank Deposit' }, { key: 'rk', label: 'RK' }, { key: 'tcashamt', label: 'Total Cash Handover' },
                        { key: 'scashamt', label: 'Cash in Store / Day Cash' }, { key: 'diffamt', label: 'Difference' }
                    ])}
                </div>
            </div>

            {/* Add Field Modal */}
            {showAddModal && (
                <ModalShell
                    overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    panelClassName="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200"
                >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Custom Field</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                <select 
                                    value={newFieldData.category}
                                    onChange={(e) => setNewFieldData(prev => ({...prev, category: e.target.value}))}
                                    className={elements.input}
                                >
                                    {['Opening', 'Sales', 'Purchase', 'Transfers', 'Expenses', 'Receipt by', 'Overall Summary'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field Name</label>
                                <input 
                                    type="text"
                                    value={newFieldData.label}
                                    onChange={(e) => setNewFieldData(prev => ({...prev, label: e.target.value}))}
                                    placeholder="e.g. Fuel, Maintenance..."
                                    className={elements.input}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field Type</label>
                                <select 
                                    value={newFieldData.type}
                                    onChange={(e) => setNewFieldData(prev => ({...prev, type: e.target.value}))}
                                    className={elements.input}
                                >
                                    <option value="number">Number (Amount)</option>
                                    <option value="text">Text (Notes)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 mt-8">
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddField}
                                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm"
                            >
                                Add Field
                            </button>
                        </div>
                </ModalShell>
            )}
        </div>
    );
};

export default StoreExpense;
