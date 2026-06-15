import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { elements } from '../theme/elements';
import { ModalShell, PageHeader } from '../components/ui';
import { 
    Banknote, Plus, Trash2, Loader2, Save, RefreshCw, Calendar, X
} from 'lucide-react';
import Swal from '../utils/tempSwal.jsx';

const MOCK_LEDGERS = [
    { ledid: '1', ledname: 'Electricity Bill', agrpid: '102' },
    { ledid: '2', ledname: 'Internet Bill', agrpid: '102' },
    { ledid: '3', ledname: 'Salary Account', agrpid: '102' },
    { ledid: '4', ledname: 'Party Cash In', agrpid: '103' },
    { ledid: '5', ledname: 'Misc Income', agrpid: '104' }
];

const MOCK_GROUPS = [
    { agrpid: '101', agrp: 'Direct Expenses' },
    { agrpid: '102', agrp: 'Indirect Expenses' },
    { agrpid: '103', agrp: 'Direct Incomes' },
    { agrpid: '104', agrp: 'Indirect Incomes' }
];

const INITIAL_ENTRIES = [
    { fdocid: 'DOC-001', ledname: 'Party Cash In', narration: 'Advance from customer', dc: 'C', amount: '5000.00' },
    { fdocid: 'DOC-002', ledname: 'Electricity Bill', narration: 'Paid June bill', dc: 'D', amount: '1200.00' },
    { fdocid: 'DOC-003', ledname: 'Misc Income', narration: 'Scrap sale', dc: 'C', amount: '350.00' }
];

const CashEntry = () => {
    const { user, actionPermissions } = useAuth();
    const { notification } = useNotification();
    
    const userRole = (user?.accesslevel || 'store').toLowerCase();
    const permissions = actionPermissions[userRole] || {};
    const canAddLedger = permissions.cashentry_add_ledger !== false; // default true if undefined

    // State
    const [saving, setSaving] = useState(false);
    
    const [entries, setEntries] = useState(() => {
        const saved = localStorage.getItem('carture_cashentry_entries');
        return saved ? JSON.parse(saved) : INITIAL_ENTRIES;
    });
    
    const [ledgers, setLedgers] = useState(() => {
        const saved = localStorage.getItem('carture_cashentry_ledgers');
        return saved ? JSON.parse(saved) : MOCK_LEDGERS;
    });
    
    useEffect(() => {
        localStorage.setItem('carture_cashentry_entries', JSON.stringify(entries));
    }, [entries]);

    useEffect(() => {
        localStorage.setItem('carture_cashentry_ledgers', JSON.stringify(ledgers));
    }, [ledgers]);

    const opcash = 10000.00;

    const [form, setForm] = useState({
        date: new Date().toISOString().split('T')[0],
        accType: '',
        narration: '',
        amount: ''
    });

    const [showLedgerModal, setShowLedgerModal] = useState(false);
    const [ledgerForm, setLedgerForm] = useState({
        name: '',
        gstin: '',
        group: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setForm(prev => ({ ...prev, [id]: value }));
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value !== '' && !/^\d{0,10}(\.\d{0,2})?$/.test(value)) return;
        setForm(prev => ({ ...prev, amount: value }));
    };

    const handleAddEntry = async () => {
        const { date, accType, narration, amount } = form;
        
        if (!date || !accType || !narration || !amount) {
            notification('Please fill all required fields', 'warning');
            return;
        }

        setSaving(true);
        setTimeout(() => {
            const ledger = ledgers.find(l => l.ledid === accType);
            const accountName = ledger?.ledname || '';
            const isExpense = ledger?.agrpid === '101' || ledger?.agrpid === '102';
            const dc = isExpense ? 'D' : 'C';

            const newEntry = {
                fdocid: `DOC-${Math.floor(Math.random() * 10000)}`,
                ledname: accountName,
                narration,
                dc,
                amount
            };

            setEntries(prev => [newEntry, ...prev]);
            notification(`Entry saved as ${isExpense ? 'Debit (Expense)' : 'Credit (Income)'}`, 'success');
            setForm(prev => ({
                ...prev,
                accType: '',
                narration: '',
                amount: ''
            }));
            setSaving(false);
        }, 800);
    };

    const handleDeleteEntry = async (fdocid) => {
        const confirm = await Swal.fire({
            title: 'Delete Entry?',
            text: 'Are you sure you want to delete this cash entry?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete'
        });

        if (confirm.isConfirmed) {
            setEntries(prev => prev.filter(e => e.fdocid !== fdocid));
            notification('Entry deleted successfully', 'success');
        }
    };

    const handleGetSales = async () => {
        if (!form.date) return;
        setSaving(true);
        setTimeout(() => {
            notification('Sales loaded from POS successfully', 'success');
            setSaving(false);
        }, 1000);
    };

    const handleDayClose = async () => {
        if (!form.date) return;
        const confirm = await Swal.fire({
            title: 'Close Day?',
            text: `Are you sure you want to close the day with balance: ₹ ${closingBalance}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Close Day'
        });

        if (confirm.isConfirmed) {
            setSaving(true);
            setTimeout(() => {
                notification('Day closed successfully', 'success');
                setSaving(false);
            }, 1000);
        }
    };

    const handleAddLedger = () => {
        const { name, group } = ledgerForm;
        if (!name || !group) {
            notification('Please fill required ledger fields', 'warning');
            return;
        }

        const newLedger = {
            ledid: `L${Math.floor(Math.random() * 1000)}`,
            ledname: name,
            agrpid: group
        };

        setLedgers(prev => [...prev, newLedger]);
        notification('Ledger account created', 'success');
        setShowLedgerModal(false);
        setLedgerForm({ name: '', gstin: '', group: '' });
    };

    const calculateClosingBalance = () => {
        const totalEntries = entries.reduce((sum, row) => {
            const val = parseFloat(row.amount || 0);
            return row.dc === 'C' ? sum + val : sum - val;
        }, 0);
        return (opcash + totalEntries).toFixed(2);
    };

    const closingBalance = calculateClosingBalance();

    return (
        <div className={elements.pageContainer}>
            <PageHeader
                icon={Banknote}
                title="Cash Entry"
                subtitle="Manage daily cash receipts and payments"
                iconClassName="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-600/30"
                actions={(
                    <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
                        <button
                            onClick={handleGetSales}
                            disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-70"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                            Get Sales
                        </button>
                        <button
                            onClick={handleDayClose}
                            disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all shadow-md shadow-rose-500/20 active:scale-95 disabled:opacity-70"
                        >
                            <X size={18} />
                            Day Close
                        </button>
                        {canAddLedger && (
                        <button
                            onClick={() => setShowLedgerModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl font-bold transition-all shadow-sm active:scale-95"
                        >
                            <Plus size={18} />
                            Add Ledger
                        </button>
                        )}
                    </div>
                )}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                {/* Left Panel: Form */}
                <div className={`${elements.card} p-6 space-y-5 sticky top-24 lg:col-span-1`}>
                    <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800/50 pb-3">
                        <Plus size={18} className="text-indigo-500" />
                        New Transaction
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className={elements.label}>To Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="date"
                                    id="date"
                                    value={form.date}
                                    onChange={handleInputChange}
                                    className={`${elements.input} pl-10`}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={elements.label}>Account</label>
                            <select
                                id="accType"
                                value={form.accType}
                                onChange={handleInputChange}
                                className={elements.input}
                            >
                                <option value="">Select Account</option>
                                {ledgers.map(ledger => (
                                    <option key={ledger.ledid} value={ledger.ledid}>{ledger.ledname}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className={elements.label}>Narration</label>
                            <textarea
                                id="narration"
                                value={form.narration}
                                onChange={handleInputChange}
                                className={`${elements.input} h-20 resize-none`}
                                placeholder="Enter details..."
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className={elements.label}>Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input
                                    type="text"
                                    id="amount"
                                    value={form.amount}
                                    onChange={handleAmountChange}
                                    placeholder="0.00"
                                    className={`${elements.input} pl-8 font-bold text-indigo-600 dark:text-indigo-400`}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleAddEntry}
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-70 mt-2"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Save Entry
                        </button>
                    </div>
                </div>

                {/* Right Panel: Data Table */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Balances Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-indigo-500/50 dark:border-indigo-500/30 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Opening Balance</p>
                            <h3 className="text-3xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">₹ {opcash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-emerald-500/50 dark:border-emerald-500/30 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Closing Balance</p>
                            <h3 className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">₹ {parseFloat(closingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className={`${elements.card} overflow-hidden flex flex-col min-h-[400px]`}>
                        {entries.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 text-gray-400">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-full">
                                    <Banknote size={48} className="opacity-20" />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No transactions for this date</p>
                                    <p className="text-sm mt-1">Add a new entry from the left panel to get started.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto custom-scrollbar flex-1">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800/50">
                                        <tr>
                                            <th className="p-4 font-bold text-xs uppercase text-gray-500 dark:text-gray-400 w-16 text-center">S.No</th>
                                            <th className="p-4 font-bold text-xs uppercase text-gray-500 dark:text-gray-400">Account Name</th>
                                            <th className="p-4 font-bold text-xs uppercase text-gray-500 dark:text-gray-400">Narration</th>
                                            <th className="p-4 font-bold text-xs uppercase text-gray-500 dark:text-gray-400 text-right">Credit (₹)</th>
                                            <th className="p-4 font-bold text-xs uppercase text-gray-500 dark:text-gray-400 text-right">Debit (₹)</th>
                                            <th className="p-4 font-bold text-xs uppercase text-gray-500 dark:text-gray-400 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800/50 text-sm">
                                        {entries.map((row, idx) => (
                                            <tr key={row.fdocid} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                                                <td className="p-4 text-center font-mono text-gray-400 dark:text-gray-500">{idx + 1}</td>
                                                <td className="p-4 font-bold text-gray-800 dark:text-gray-200">{row.ledname}</td>
                                                <td className="p-4 text-gray-500 dark:text-gray-400 italic max-w-xs">{row.narration}</td>
                                                <td className="p-4 text-right font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                                    {row.dc === 'C' ? parseFloat(row.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}
                                                </td>
                                                <td className="p-4 text-right font-black text-rose-500 dark:text-rose-400 font-mono">
                                                    {row.dc === 'D' ? Math.abs(parseFloat(row.amount)).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() => handleDeleteEntry(row.fdocid)}
                                                        className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                                                        title="Delete Entry"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Ledger Account Modal */}
            {showLedgerModal && (
                <ModalShell
                    onClose={() => setShowLedgerModal(false)}
                    overlayClassName="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                    panelClassName="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200"
                >
                        <div className="p-6 border-b border-gray-50 dark:border-gray-800/50 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Plus size={20} className="text-indigo-500" />
                                New Ledger Account
                            </h3>
                            <button onClick={() => setShowLedgerModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"><X size={20}/></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className={elements.label}>Ledger Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Electricity Bill"
                                    value={ledgerForm.name}
                                    onChange={(e) => setLedgerForm(prev => ({ ...prev, name: e.target.value }))}
                                    className={elements.input}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className={elements.label}>GSTIN (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="15-digit code"
                                    maxLength={15}
                                    value={ledgerForm.gstin}
                                    onChange={(e) => setLedgerForm(prev => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                                    className={`${elements.input} font-mono`}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className={elements.label}>Account Group</label>
                                <select
                                    value={ledgerForm.group}
                                    onChange={(e) => setLedgerForm(prev => ({ ...prev, group: e.target.value }))}
                                    className={elements.input}
                                >
                                    <option value="">Select Group</option>
                                    {MOCK_GROUPS.map(group => (
                                        <option key={group.agrpid} value={group.agrpid}>{group.agrp}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-800/30 flex gap-3">
                            <button
                                onClick={() => setShowLedgerModal(false)}
                                className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-all shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddLedger}
                                className="flex-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                            >
                                Create Ledger
                            </button>
                        </div>
                </ModalShell>
            )}
        </div>
    );
};

export default CashEntry;
