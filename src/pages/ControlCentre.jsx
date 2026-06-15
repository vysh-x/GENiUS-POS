import React, { useState } from 'react';
import { elements } from '../theme/elements';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { PageHeader } from '../components/ui';
import { Shield, Store, Code, ChevronRight, FileText, LayoutDashboard, Settings, Package, DollarSign, Receipt, User, RefreshCw, Banknote, ShieldCheck, Database, Calendar, Trash, Trash2, MinusCircle, Loader2 } from 'lucide-react';

const ControlCentre = () => {
    const { user, rolePermissions, updateRolePermission, actionPermissions, updateActionPermission } = useAuth();
    const notify = useNotification();
    const [selectedUserType, setSelectedUserType] = useState(null);
    const [selectedModule, setSelectedModule] = useState('reports');
    const [showAdminModule, setShowAdminModule] = useState(false);

    // Administration states
    const [adminActiveTab, setAdminActiveTab] = useState('salesDateChange');
    const [adminLoading, setAdminLoading] = useState(false);
    const [reduceInvSearch, setReduceInvSearch] = useState('');
    const [invMmtDocId, setInvMmtDocId] = useState('');
    const [dummyInput, setDummyInput] = useState('');
    const [invDateSearch, setInvDateSearch] = useState('');
    const [fetchedInvDate, setFetchedInvDate] = useState(null);
    const [newInvDate, setNewInvDate] = useState('');
    const [fetchedInvItems, setFetchedInvItems] = useState(null);

    const adminTabs = [
        { id: 'invoiceDateChange', label: 'Invoice Date Change', icon: Calendar },
        { id: 'reduceInvItem', label: 'Reduce Invoice Item', icon: MinusCircle },
        { id: 'deleteInvoice', label: 'Delete Invoice', icon: Trash2 },
        { id: 'alcGrnDateChange', label: 'ALC GRN Date Change', icon: RefreshCw },
        { id: 'deleteInventoryMovement', label: 'Delete INV Movement', icon: Trash },
        { id: 'forceDataSync', label: 'Force Data Sync', icon: Database }
    ];

    const handleExecuteAdmin = (msg) => {
        setAdminLoading(true);
        setTimeout(() => {
            notify.notification(msg + ' successfully', 'success');
            setAdminLoading(false);
            setInvMmtDocId('');
            setFetchedInvDate(null);
            setInvDateSearch('');
            setNewInvDate('');
            setFetchedInvItems(null);
            setReduceInvSearch('');
            setDummyInput('');
        }, 1000);
    };


    const userTypes = [
        { id: 'admin', title: 'Admin', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { id: 'store', title: 'Store', icon: Store, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
        { id: 'developer', title: 'Developer', icon: Code, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' }
    ];

    const modulesList = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'storeexpense', label: 'Store Expense', icon: DollarSign },
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'massinvoice', label: 'Mass Invoice', icon: Receipt },
        { id: 'users', label: 'Users', icon: User },
        { id: 'masstransfer', label: 'Mass Stock Transfer', icon: RefreshCw },
        { id: 'cashentry', label: 'Cash Entry', icon: Banknote },
        { id: 'masters', label: 'Masters', icon: Database },
        { id: 'controlcentre', label: 'Control Centre', icon: Settings },
    ];

    // 1. Initial View: Select User Type
    if (!selectedUserType && !showAdminModule) {
        return (
            <div className={elements.pageContainer}>
                <PageHeader
                    icon={Settings}
                    title="Control Centre"
                    subtitle="Manage User permissions and Administrative processes"
                    iconClassName="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-600/30"
                />

                {/* Internal Permissions check for the logged in user */}
                {(() => {
                    const currentUserType = user?.type || user?.role || 'admin';
                    const canConfigureRoles = actionPermissions[currentUserType]?.admin_allow_user_permissions !== false;
                    const canAccessAdmin = actionPermissions[currentUserType]?.admin_allow_admin_actions !== false;

                    return (
                        <>
                            {canConfigureRoles && (
                                <>
                                    <h2 className={elements.sectionTitle}>Select User Role to Configure</h2>
                                    <div className={elements.grid3Col}>
                                        {userTypes.map((type) => (
                                            <article 
                                                key={type.id} 
                                                onClick={() => setSelectedUserType(type.id)}
                                                className={`${elements.statCard} cursor-pointer group`}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`w-12 h-12 flex items-center justify-center rounded-xl ${type.bg} ${type.color} shrink-0 transition-transform group-hover:scale-110`}>
                                                            <type.icon size={24} />
                                                        </span>
                                                    </div>
                                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-700/50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                        <ChevronRight size={20} />
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{type.title} Role</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Configure which modules and settings the {type.title.toLowerCase()} users can access.</p>
                                            </article>
                                        ))}
                                    </div>
                                </>
                            )}
                            
                            {canAccessAdmin && (
                                <div className="mt-8">
                                    <h2 className={elements.sectionTitle}>Administrative Actions</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <article 
                                            onClick={() => { setShowAdminModule(true); setAdminActiveTab('invoiceDateChange'); }}
                                            className={`${elements.statCard} cursor-pointer group`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-12 h-12 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 shrink-0 transition-transform group-hover:scale-110`}>
                                                        <ShieldCheck size={24} />
                                                    </span>
                                                </div>
                                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-700/50 text-gray-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                                                    <ChevronRight size={20} />
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Administration</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Access date changes, deletions, and specific go-live operations.</p>
                                        </article>
                                    </div>
                                </div>
                            )}

                            {!canConfigureRoles && !canAccessAdmin && (
                                <div className="py-12 flex flex-col items-center justify-center text-gray-400 text-center bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                    <Shield className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Access Restricted</h3>
                                    <p className="text-sm max-w-sm">You do not have permission to configure roles or access administrative actions.</p>
                                </div>
                            )}
                        </>
                    );
                })()}
            </div>
        );
    }

    if (showAdminModule) {
        return (
            <div className={elements.pageContainer}>
                <header className={`${elements.pageHeader} !mb-6 shrink-0`}>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setShowAdminModule(false)}
                            className={elements.iconButton}
                            title="Back to Control Centre"
                        >
                            <ChevronRight className="rotate-180" size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`w-6 h-6 flex items-center justify-center rounded-md bg-red-50 dark:bg-red-900/20 text-red-600`}>
                                    <ShieldCheck size={14} />
                                </span>
                                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Restricted Access</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Administration Operations</h1>
                        </div>
                    </div>
                </header>

                <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden min-h-[500px]">
                    {/* Sidebar */}
                    <div className="w-64 shrink-0 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                        {adminTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setAdminActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-3 px-4 py-4 text-sm font-medium transition-colors text-left border-b border-gray-200 dark:border-gray-700/50
                                    ${adminActiveTab === tab.id 
                                        ? 'bg-white dark:bg-gray-800 text-blue-600 border-l-4 border-l-blue-600' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/30 border-l-4 border-l-transparent'}
                                `}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    
                    {/* Content Area */}
                    <div className="flex-1 p-8 bg-white dark:bg-gray-800">
                        {(adminActiveTab === 'invoiceDateChange' || adminActiveTab === 'alcGrnDateChange') && (
                            <div className="space-y-6">
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{adminActiveTab === 'invoiceDateChange' ? 'Change Invoice Date' : 'Change GRN Date'}</h4>
                                <div className="space-y-4 max-w-md">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={invDateSearch}
                                            onChange={(e) => setInvDateSearch(e.target.value)}
                                            className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-transparent dark:text-white"
                                            placeholder={adminActiveTab === 'invoiceDateChange' ? "Enter Invoice No" : "Enter GRN No"}
                                        />
                                        <button 
                                            onClick={() => setFetchedInvDate(adminActiveTab === 'invoiceDateChange' ? '2026-06-01' : '2026-06-02')}
                                            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                        >
                                            Fetch
                                        </button>
                                    </div>
                                    
                                    {fetchedInvDate && (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Original Date:</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{fetchedInvDate}</span>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Date</label>
                                                <input 
                                                    type="date" 
                                                    value={newInvDate}
                                                    onChange={(e) => setNewInvDate(e.target.value)}
                                                    className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-white dark:bg-gray-900 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleExecuteAdmin(`${adminActiveTab === 'invoiceDateChange' ? 'Invoice' : 'GRN'} date changed`)}
                                        disabled={adminLoading || !fetchedInvDate || !newInvDate}
                                        className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {adminLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                                        Execute Date Change
                                    </button>
                                </div>
                            </div>
                        )}



                        {adminActiveTab === 'reduceInvItem' && (
                            <div className="space-y-6">
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Reduce Invoice Item</h4>
                                <div className="space-y-4 max-w-2xl">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={reduceInvSearch}
                                            onChange={(e) => setReduceInvSearch(e.target.value)}
                                            className="flex-1 border border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-transparent dark:text-white"
                                            placeholder="Enter Invoice No"
                                        />
                                        <button 
                                            onClick={() => setFetchedInvItems([
                                                { id: 1, name: 'Kingfisher Premium 650ml', qty: 10, val: 1500 },
                                                { id: 2, name: 'Old Monk Rum 750ml', qty: 5, val: 2250 }
                                            ])}
                                            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                        >
                                            Fetch Items
                                        </button>
                                    </div>

                                    {fetchedInvItems && (
                                        <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                                    <tr>
                                                        <th className="px-4 py-3 font-medium">Item Name</th>
                                                        <th className="px-4 py-3 font-medium">Qty</th>
                                                        <th className="px-4 py-3 font-medium">Value (₹)</th>
                                                        <th className="px-4 py-3 font-medium text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                    {fetchedInvItems.map((item) => (
                                                        <tr key={item.id} className="bg-white dark:bg-gray-900">
                                                            <td className="px-4 py-3 text-gray-900 dark:text-white">{item.name}</td>
                                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.qty}</td>
                                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.val}</td>
                                                            <td className="px-4 py-3 text-right">
                                                                <button
                                                                    onClick={() => setFetchedInvItems(fetchedInvItems.filter(i => i.id !== item.id))}
                                                                    disabled={adminLoading}
                                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 inline-flex"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {fetchedInvItems && (
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={() => handleExecuteAdmin('Items updated')}
                                                disabled={adminLoading}
                                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {adminLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                                                Save Changes
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {adminActiveTab === 'deleteInventoryMovement' && (
                            <div className="space-y-6">
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Delete Inventory Movement</h4>
                                <div className="max-w-md space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document Number</label>
                                        <input
                                            type="text"
                                            value={invMmtDocId}
                                            onChange={(e) => setInvMmtDocId(e.target.value)}
                                            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none dark:text-white"
                                            placeholder="Enter Doc ID to delete..."
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleExecuteAdmin('Document deleted')}
                                        disabled={adminLoading}
                                        className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {adminLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                        Delete Document
                                    </button>
                                </div>
                            </div>
                        )}

                        {adminActiveTab === 'deleteInvoice' && (
                            <div className="space-y-6">
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Delete Entire Invoice</h4>
                                <div className="max-w-md space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Invoice Number to Void</label>
                                        <input
                                            type="text"
                                            value={dummyInput}
                                            onChange={(e) => setDummyInput(e.target.value)}
                                            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none dark:text-white"
                                            placeholder="Enter Invoice No..."
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleExecuteAdmin('Invoice deleted')}
                                        disabled={adminLoading}
                                        className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {adminLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                        Void Invoice
                                    </button>
                                </div>
                            </div>
                        )}

                        {adminActiveTab === 'forceDataSync' && (
                            <div className="space-y-6">
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Force Data Sync</h4>
                                <div className="max-w-md space-y-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Use this to manually push all pending transactions and fetch latest product catalog updates from the central server.
                                    </p>
                                    <button
                                        onClick={() => handleExecuteAdmin('Data synchronization completed')}
                                        disabled={adminLoading}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {adminLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
                                        Start Synchronization
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // 2. Secondary View: Module List & Controls
    const currentUser = userTypes.find(u => u.id === selectedUserType);
    const activeModInfo = modulesList.find(m => m.id === selectedModule) || modulesList[0];
    
    // Check if current module is visible for the selected role
    const allowedModules = rolePermissions[selectedUserType] || [];
    const isModuleVisible = allowedModules.includes(selectedModule);

    const toggleModuleVisibility = () => {
        updateRolePermission(selectedUserType, selectedModule, !isModuleVisible);
    };

    return (
        <div className={`${elements.pageContainer} flex flex-col h-[calc(100vh-6rem)]`}>
            {/* Header with Back Button */}
            <header className={`${elements.pageHeader} !mb-6 shrink-0`}>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setSelectedUserType(null)}
                        className={elements.iconButton}
                        title="Back to Roles"
                    >
                        <ChevronRight className="rotate-180" size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`w-6 h-6 flex items-center justify-center rounded-md ${currentUser.bg} ${currentUser.color}`}>
                                <currentUser.icon size={14} />
                            </span>
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{currentUser.title} Access</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Module Configurations</h1>
                    </div>
                </div>
            </header>

            {/* Split Layout */}
            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
                {/* Left: Module List */}
                <div className="w-full md:w-80 flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Available Modules</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {modulesList.map((mod) => (
                            <button
                                key={mod.id}
                                onClick={() => setSelectedModule(mod.id)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    selectedModule === mod.id
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <mod.icon size={18} />
                                <div className="flex-1 text-left">{mod.label}</div>
                                {allowedModules.includes(mod.id) && (
                                    <div className="w-2 h-2 rounded-full bg-green-500" title="Visible"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Controls */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-y-auto p-6">
                    {/* Universal Top Toggle */}
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700/50">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shrink-0">
                            <activeModInfo.icon size={24} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeModInfo.label}</h2>
                            <p className="text-sm text-gray-500">Configure global access and inner settings for {currentUser.title}s.</p>
                        </div>
                        {(selectedModule !== 'controlcentre' || selectedUserType !== 'admin') && (
                        <div className="flex flex-col items-end gap-2 ml-4">
                            <span className={`text-xs font-bold uppercase ${isModuleVisible ? 'text-green-600' : 'text-gray-400'}`}>
                                {isModuleVisible ? 'Visible in Sidebar' : 'Hidden from User'}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={isModuleVisible} onChange={toggleModuleVisibility} />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        )}
                    </div>

                    {/* Specific Inner Module Controls */}
                    <div className={`transition-opacity duration-300 ${isModuleVisible || (selectedModule === 'controlcentre' && selectedUserType === 'admin') ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Internal Permissions</h3>
                        
                        {selectedModule === 'dashboard' ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Deletions</h4>
                                        <p className="text-sm text-gray-500">Allow user to view deletions on the dashboard.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={actionPermissions[selectedUserType]?.dashboard_view_key_events || false} onChange={(e) => updateActionPermission(selectedUserType, 'dashboard_view_key_events', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        ) : selectedModule === 'users' ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Edit User Type</h4>
                                        <p className="text-sm text-gray-500">Allow user to change roles (e.g. staff to manager).</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={actionPermissions[selectedUserType]?.users_edit || false} onChange={(e) => updateActionPermission(selectedUserType, 'users_edit', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Toggle User Status</h4>
                                        <p className="text-sm text-gray-500">Allow user to toggle user access on or off.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={actionPermissions[selectedUserType]?.users_activate || false} onChange={(e) => updateActionPermission(selectedUserType, 'users_activate', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        ) : selectedModule === 'reports' ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Audit Reports</h4>
                                        <p className="text-sm text-gray-500">Allow user to view system logs, voids, and comps.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={actionPermissions[selectedUserType]?.reports_audit || false} onChange={(e) => updateActionPermission(selectedUserType, 'reports_audit', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Inventory Reports</h4>
                                        <p className="text-sm text-gray-500">Allow user to view stock levels and valuations.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={actionPermissions[selectedUserType]?.reports_inventory || false} onChange={(e) => updateActionPermission(selectedUserType, 'reports_inventory', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Export / Download Reports</h4>
                                        <p className="text-sm text-gray-500">Allow user to download and export reports (PDF, CSV, Excel).</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={actionPermissions[selectedUserType]?.reports_export || false} onChange={(e) => updateActionPermission(selectedUserType, 'reports_export', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        ) : selectedModule === 'inventory' ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">New Movements</h4>
                                        <p className="text-sm text-gray-500">Allow user to create new inventory movements/adjustments.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={actionPermissions[selectedUserType]?.inventory_new_movement || false} onChange={(e) => updateActionPermission(selectedUserType, 'inventory_new_movement', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        ) : selectedModule === 'storeexpense' ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Custom Fields</h4>
                                        <p className="text-sm text-gray-500">Allow user to dynamically add new text or number fields to expense categories.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={actionPermissions[selectedUserType]?.expense_add_fields || false} onChange={(e) => updateActionPermission(selectedUserType, 'expense_add_fields', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        ) : selectedModule === 'cashentry' ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">New Ledgers</h4>
                                        <p className="text-sm text-gray-500">Allow user to create new ledger accounts in the Cash Entry module.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={actionPermissions[selectedUserType]?.cashentry_add_ledger || false} onChange={(e) => updateActionPermission(selectedUserType, 'cashentry_add_ledger', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        ) : selectedModule === 'controlcentre' ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Role Configuration</h4>
                                        <p className="text-sm text-gray-500">Allow user to modify user access and roles.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={actionPermissions[selectedUserType]?.admin_allow_user_permissions ?? true} onChange={(e) => updateActionPermission(selectedUserType, 'admin_allow_user_permissions', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Administrative Actions</h4>
                                        <p className="text-sm text-gray-500">Allow user to access all administrative sub-modules.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={actionPermissions[selectedUserType]?.admin_allow_admin_actions ?? true} onChange={(e) => updateActionPermission(selectedUserType, 'admin_allow_admin_actions', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        ) : selectedModule === 'masters' ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Toggle Active Status</h4>
                                        <p className="text-sm text-gray-500">Allow user to activate and deactivate the data in master module.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={actionPermissions[selectedUserType]?.masters_allow_active || false} onChange={(e) => updateActionPermission(selectedUserType, 'masters_allow_active', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Edit & Delete Options</h4>
                                        <p className="text-sm text-gray-500">Allow user to edit and delete data from master module.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={actionPermissions[selectedUserType]?.masters_allow_edit_delete || false} onChange={(e) => updateActionPermission(selectedUserType, 'masters_allow_edit_delete', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-gray-400 text-center bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                    <Settings size={28} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Internal Settings</h3>
                                <p className="text-sm max-w-sm">Global visibility controls the entire module. Inner specific settings are not mapped for this module yet.</p>
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default ControlCentre;
