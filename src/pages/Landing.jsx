import React, { lazy, Suspense, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { elements } from '../theme/elements';
import ThemeToggle from '../components/ThemeToggle';
import {
    Menu,
    Bell,
    LogOut,
    User,
    LayoutDashboard,
    Store,
    ChevronDown,
    X,
    FileText,
    DollarSign,
    Receipt,
    Upload,
    Beer,
    Package,
    RefreshCw,
    Banknote,
    ShieldCheck,
    Database,
    Settings
} from 'lucide-react';

const Reports = lazy(() => import('./Reports'));
const StoreExpense = lazy(() => import('./StoreExpense'));
const MassInvoice = lazy(() => import('./MassInvoice'));
const MassStockTransfer = lazy(() => import('./MassStockTransfer'));
const Dashboard = lazy(() => import('./Dashboard'));
const UploadIndent = lazy(() => import('./UploadIndent'));
const GrnAlcohol = lazy(() => import('./GrnAlcohol'));
const Inventory = lazy(() => import('./Inventory'));
const TotalSalesAcrossStores = lazy(() => import('./TotalSalesAcrossStores'));
const SellingPriceMaster = lazy(() => import('./SellingPriceMaster'));
const CashEntry = lazy(() => import('./CashEntry'));
const Users = lazy(() => import('./Users'));
const Masters = lazy(() => import('./Masters'));
const ControlCentre = lazy(() => import('./ControlCentre'));

const ModuleFallback = () => (
    <div className="min-h-[50vh] flex items-center justify-center text-gray-500 dark:text-gray-400">
        Loading module...
    </div>
);

const Landing = () => {
    const { user, logout, license, rolePermissions } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeModule, setActiveModule] = useState('dashboard');
    const [profileOpen, setProfileOpen] = useState(false);

    const modules = useMemo(() => {
        const masterList = [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'controlcentre', label: 'Control Centre', icon: Settings },
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'storeexpense', label: 'Store Expense', icon: DollarSign },
            { id: 'inventory', label: 'Inventory', icon: Package },
            { id: 'massinvoice', label: 'Mass Invoice', icon: Receipt },
            { id: 'users', label: 'Users', icon: User },
            { id: 'masstransfer', label: 'Mass Stock Transfer', icon: RefreshCw },
            { id: 'uploadindent', label: 'Upload Indent', icon: Upload },
            { id: 'grnalcohol', label: 'GRN Alcohol', icon: Beer },
            { id: 'totsales', label: 'Total Sales', icon: Store },
            { id: 'sellingprice', label: 'Selling Price Master', icon: DollarSign },
            { id: 'cashentry', label: 'Cash Entry', icon: Banknote },
            { id: 'masters', label: 'Masters', icon: Database },
        ];
        
        // Filter the master list based on the user's role permissions
        const userRole = (user?.accesslevel || 'store').toLowerCase();
        const allowedModuleIds = rolePermissions[userRole] || [];
        
        return masterList.filter(mod => allowedModuleIds.includes(mod.id));
    }, [user?.accesslevel, rolePermissions]);

    // Determine the actual shop name for display
    const activeShopId = user?.customerId || user?.shopId || user?.store?.customerid;
    const shopName = user?.store?.storename ||
        license?.stores?.find(s => s.customerid === activeShopId)?.storename ||
        'Store Name';

    // Toggle sidebar for mobile/desktop
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleLogout = () => {
        logout();
        // Redirect handled by App.jsx or protected route
    };

    // Handle module selection and auto-close sidebar
    const handleModuleSelect = (moduleId) => {
        setActiveModule(moduleId);
        setSidebarOpen(false); // Auto-close sidebar after selection
    };

    return (
        <div className={elements.layoutContainer}>
            {/* Top Bar */}
            <header className={elements.topBar}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="font-bold text-lg truncate max-w-[200px] sm:max-w-md">
                        {shopName}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            onMouseEnter={() => setProfileOpen(true)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                <User size={18} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Profile Dropdown */}
                        {profileOpen && (
                            <div
                                onMouseLeave={() => setProfileOpen(false)}
                                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2"
                            >
                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm font-medium truncate">{user?.userName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">ID: {user?.userId}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex pt-16">
                {/* Sidebar */}
                <aside
                    className={`
            fixed top-16 bottom-0 left-0 z-30 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out overflow-y-auto
            ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}
          `}
                >
                    <div className="py-4 px-3 space-y-2">
                        {modules.map((module) => (
                            <button
                                key={module.id}
                                onClick={() => handleModuleSelect(module.id)}
                                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${activeModule === module.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                `}
                            >
                                <module.icon size={20} />
                                <span className="whitespace-nowrap">{module.label}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className={`flex-1 min-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
                    <div className="max-w-7xl mx-auto">
                        <Suspense fallback={<ModuleFallback />}>
                            {activeModule === 'reports' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <Reports />
                                </div>
                            )}

                            {activeModule === 'storeexpense' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <StoreExpense />
                                </div>
                            )}

                            {activeModule === 'massinvoice' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <MassInvoice />
                                </div>
                            )}

                            {activeModule === 'dashboard' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <Dashboard />
                                </div>
                            )}

                            {activeModule === 'controlcentre' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <ControlCentre />
                                </div>
                            )}

                            {activeModule === 'uploadindent' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <UploadIndent />
                                </div>
                            )}

                            {activeModule === 'grnalcohol' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <GrnAlcohol />
                                </div>
                            )}

                            {activeModule === 'inventory' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <Inventory />
                                </div>
                            )}

                            {activeModule === 'masstransfer' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <MassStockTransfer />
                                </div>
                            )}

                            {activeModule === 'totsales' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <TotalSalesAcrossStores />
                                </div>
                            )}

                            {activeModule === 'sellingprice' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <SellingPriceMaster />
                                </div>
                            )}

                            {activeModule === 'cashentry' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <CashEntry />
                                </div>
                            )}

                            {activeModule === 'users' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <Users />
                                </div>
                            )}

                            {activeModule === 'masters' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <Masters />
                                </div>
                            )}
                        </Suspense>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Landing;
