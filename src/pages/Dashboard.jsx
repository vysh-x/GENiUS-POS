import React, { useState, useEffect } from 'react';
import {
    BarChart2,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Percent,
    ShoppingCart,
    Package,
    Archive,
    Download,
    RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { elements } from '../theme/elements';
import { PageHeader } from '../components/ui';

const Dashboard = () => {
    const { user, actionPermissions } = useAuth();
    // Initialize with local date in YYYY-MM-DD format
    const [selectedDate, setSelectedDate] = useState(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Simulate network delay
            await new Promise(r => setTimeout(r, 600));

            // Generate dummy static data
            const dummyData = {
                total_stock: 12543,
                alc_valuation: 450000.50,
                nalc_valuation: 125000.75,
                alc_purchase_amt: 85000,
                nalc_purchase_amt: 32000,
                totsales_today: 45000,
                totsales_mtd: 1250000,
                collections_card: 15000,
                collections_upi: 22000,
                collections_cash: 8000,
                alc_price_up_cnt: 15,
                alc_price_down_cnt: 3,
                alc_val_change: 12500,
                nalc_price_up_cnt: 8,
                nalc_price_down_cnt: 2,
                nalc_val_change: -2500,
                expenses: 12500,
                discounts: 3500,
                del_sales_cnt: 5,
                del_sales_value: 4500,
                del_alc_pur_cnt: 2,
                del_alc_pur_val: 12000,
                del_nalc_pur_cnt: 1,
                del_nalc_pur_val: 1500
            };

            setData(dummyData);
        } catch (err) {
            console.error(err);
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user, selectedDate]);

    const formatCurrency = (value) => {
        if (value === undefined || value === null || value === '') return '₹0.00';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(value);
    };

    const formatNumber = (value) => {
        if (value === undefined || value === null || value === '') return '0';
        return value.toString();
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={elements.pageContainer}>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-2 text-sm underline hover:text-red-800"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Default values if data is missing properties
    const d = data || {};

    const currentUserType = user?.type || user?.role || 'admin';
    const canViewDeletions = actionPermissions?.[currentUserType]?.dashboard_view_key_events !== false;

    return (
        <div className={elements.pageContainer}>
            <PageHeader
                icon={BarChart2}
                title="Operations Dashboard"
                iconClassName="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-lg shadow-blue-600/30 transition-transform hover:-translate-y-0.5"
                actions={(
                    <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    />
                    <button
                        onClick={fetchDashboardData}
                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:block">
                        Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    </div>
                )}
            />

            {/* Store Operations Section */}
            <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
                <h2 className={elements.sectionTitle}>Store Operations</h2>
                <div className={elements.grid4Col}>
                    {/* Total Stock */}
                    <article className={elements.statCard}>
                        <div className={elements.statHeader}>
                            <h3 className={elements.statTitle}>Total Stock</h3>
                        </div>
                        <div className="flex flex-col">
                            <p className={elements.statSubtitle}>Number of Materials</p>
                            <p className={elements.statValue}>
                                {formatNumber(d.total_stock)}
                            </p>
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </article>

                    {/* ALC Valuation */}
                    <article className={elements.statCard}>
                        <div className={elements.statHeader}>
                            <h3 className={elements.statTitle}>ALC Valuation</h3>
                        </div>
                        <div className="flex flex-col">
                            <p className={elements.statSubtitle}>Alcohol Materials</p>
                            <p className={elements.statValueBlue}>
                                {formatCurrency(d.alc_valuation)}
                            </p>
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </article>

                    {/* NALC Valuation */}
                    <article className={elements.statCard}>
                        <div className={elements.statHeader}>
                            <h3 className={elements.statTitle}>NALC Valuation</h3>
                        </div>
                        <div className="flex flex-col">
                            <p className={elements.statSubtitle}>Non-Alcohol Materials</p>
                            <p className={elements.statValueBlue}>
                                {formatCurrency(d.nalc_valuation)}
                            </p>
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </article>

                    {/* Purchases */}
                    <article className={elements.statCard}>
                        <div className={elements.statHeader}>
                            <h3 className={elements.statTitle}>Purchases</h3>
                        </div>
                        <div className="flex flex-col gap-0">
                            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700/50">
                                <span className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">ALC</span>
                                <span className="font-mono text-[17px] font-semibold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(d.alc_purchase_amt)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">NALC</span>
                                <span className="font-mono text-[17px] font-semibold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(d.nalc_purchase_amt)}
                                </span>
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </article>
                </div>
            </section>

            {/* Sales and Collections Section */}
            <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <div className={elements.grid2Col}>
                    {/* Total Sales */}
                    <article className={elements.statCard}>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 shrink-0">
                                    <ShoppingCart size={18} />
                                </span>
                                <h3 className={elements.statTitle}>Total Sales</h3>
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 transition-colors" aria-label="Download">
                                <Download size={18} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[14px] font-medium text-gray-600 dark:text-gray-300">Today</span>
                                <span className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(d.totsales_today)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[14px] font-medium text-gray-600 dark:text-gray-300">MTD</span>
                                <span className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(d.totsales_mtd)}
                                </span>
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </article>

                    {/* Collections */}
                    <article className={elements.statCard}>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 shrink-0">
                                    <ShoppingCart size={18} />
                                </span>
                                <h3 className={elements.statTitle}>Collections</h3>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-gray-700/30">
                                <span className="text-[14px] font-medium text-gray-600 dark:text-gray-300">Card</span>
                                <span className="font-mono text-[17px] font-semibold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(d.collections_card)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-gray-700/30">
                                <span className="text-[14px] font-medium text-gray-600 dark:text-gray-300">UPI</span>
                                <span className="font-mono text-[17px] font-semibold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(d.collections_upi)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-gray-700/30">
                                <span className="text-[14px] font-medium text-gray-600 dark:text-gray-300">Cash</span>
                                <span className="font-mono text-[17px] font-semibold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(d.collections_cash)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1 pt-2 mt-1 border-t border-gray-200 dark:border-gray-700 font-bold">
                                <span className="text-[14px] text-gray-900 dark:text-white">Total</span>
                                <span className="font-mono text-[18px] text-blue-700 dark:text-blue-300">
                                    {formatCurrency(
                                        Number(d.collections_card || 0) +
                                        Number(d.collections_upi || 0) +
                                        Number(d.collections_cash || 0)
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </article>
                </div>
            </section>

            {/* Key Events Section */}
            <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                <h2 className={elements.sectionTitle}>Key Events</h2>
                <div className={elements.grid4Col}>
                    {/* ALC Price Change */}
                    <article className={elements.statCard}>
                        <div className={elements.statHeader}>
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shrink-0">
                                    <TrendingUp size={18} />
                                </span>
                                <h3 className={elements.statTitle}>ALC Price Change</h3>
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 transition-colors" aria-label="Download">
                                <Download size={18} />
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-1 mb-4">
                                <div className="flex gap-6">
                                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider min-w-[48px]">Up</span>
                                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider min-w-[48px]">Down</span>
                                </div>
                                <div className="flex gap-6">
                                    <span className="flex items-center gap-1 font-mono text-lg font-bold text-green-600 min-w-[48px]">
                                        <TrendingUp size={14} /> {formatNumber(d.alc_price_up_cnt)}
                                    </span>
                                    <span className="flex items-center gap-1 font-mono text-lg font-bold text-red-600 min-w-[48px]">
                                        <TrendingDown size={14} /> {formatNumber(d.alc_price_down_cnt)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 pt-3 border-t border-gray-200 dark:border-gray-700/50 mt-auto">
                                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Valuation change:</span>
                                <span className="font-mono text-[17px] font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(d.alc_val_change)}
                                </span>
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </article>

                    {/* NALC Price Changes */}
                    <article className={elements.statCard}>
                        <div className={elements.statHeader}>
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shrink-0">
                                    <TrendingUp size={18} />
                                </span>
                                <h3 className={elements.statTitle}>NALC Price Changes</h3>
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 transition-colors" aria-label="Download">
                                <Download size={18} />
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-1 mb-4">
                                <div className="flex gap-6">
                                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider min-w-[48px]">Up</span>
                                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider min-w-[48px]">Down</span>
                                </div>
                                <div className="flex gap-6">
                                    <span className="flex items-center gap-1 font-mono text-lg font-bold text-green-600 min-w-[48px]">
                                        <TrendingUp size={14} /> {formatNumber(d.nalc_price_up_cnt)}
                                    </span>
                                    <span className="flex items-center gap-1 font-mono text-lg font-bold text-red-600 min-w-[48px]">
                                        <TrendingDown size={14} /> {formatNumber(d.nalc_price_down_cnt)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 pt-3 border-t border-gray-200 dark:border-gray-700/50 mt-auto">
                                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Valuation change:</span>
                                <span className="font-mono text-[17px] font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(d.nalc_val_change)}
                                </span>
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </article>

                    {/* Expenses */}
                    <article className={elements.statCard}>
                        <div className={elements.statHeader}>
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 shrink-0">
                                    <DollarSign size={18} />
                                </span>
                                <h3 className={elements.statTitle}>Expenses</h3>
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 transition-colors" aria-label="Download">
                                <Download size={18} />
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <p className={elements.statSubtitle}>Total Expenses Incurred</p>
                            <p className={elements.statValueRed}>
                                {formatCurrency(d.expenses)}
                            </p>
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </article>

                    {/* Discounts */}
                    <article className={elements.statCard}>
                        <div className={elements.statHeader}>
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 shrink-0">
                                    <Percent size={18} />
                                </span>
                                <h3 className={elements.statTitle}>Discounts</h3>
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 transition-colors" aria-label="Download">
                                <Download size={18} />
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <p className={elements.statSubtitle}>Total Discounts Given</p>
                            <p className={elements.statValuePurple}>
                                {formatCurrency(d.discounts)}
                            </p>
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </article>
                </div>
            </section>

            {/* Deletions Section */}
            {canViewDeletions && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <h2 className={elements.sectionTitle}>Deletions</h2>
                <div className={elements.grid3Col}>
                    {/* Sales */}
                    <article className={elements.statCard}>
                        <div className={elements.statHeader}>
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 shrink-0">
                                    <ShoppingCart size={18} />
                                </span>
                                <h3 className={elements.statTitle}>Sales</h3>
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 transition-colors" aria-label="Download">
                                <Download size={18} />
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <p className={elements.statSubtitle}>Invoice</p>
                            <p className="font-mono text-[1.75rem] md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                                {formatNumber(d.del_sales_cnt)}
                            </p>

                            <div className="flex flex-col gap-1 pt-3 border-t border-gray-200 dark:border-gray-700/50 mt-auto">
                                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Value</span>
                                <span className="font-mono text-[17px] font-semibold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(d.del_sales_value)}
                                </span>
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </article>

                    {/* ALC Purchase */}
                    <article className={elements.statCard}>
                        <div className={elements.statHeader}>
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shrink-0">
                                    <Package size={18} />
                                </span>
                                <h3 className={elements.statTitle}>ALC Purchase</h3>
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 transition-colors" aria-label="Download">
                                <Download size={18} />
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <p className={elements.statSubtitle}>ALC GRN Deletion Count</p>
                            <p className="font-mono text-[1.75rem] md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                                {formatNumber(d.del_alc_pur_cnt)}
                            </p>

                            <div className="flex flex-col gap-1 pt-3 border-t border-gray-200 dark:border-gray-700/50 mt-auto">
                                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Value</span>
                                <span className="font-mono text-[17px] font-semibold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(d.del_alc_pur_val)}
                                </span>
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </article>

                    {/* NALC Purchase */}
                    <article className={elements.statCard}>
                        <div className={elements.statHeader}>
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shrink-0">
                                    <Archive size={18} />
                                </span>
                                <h3 className={elements.statTitle}>NALC Purchase</h3>
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 transition-colors" aria-label="Download">
                                <Download size={18} />
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <p className={elements.statSubtitle}>NALC GRN Deletion Count</p>
                            <p className="font-mono text-[1.75rem] md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                                {formatNumber(d.del_nalc_pur_cnt)}
                            </p>

                            <div className="flex flex-col gap-1 pt-3 border-t border-gray-200 dark:border-gray-700/50 mt-auto">
                                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Value</span>
                                <span className="font-mono text-[17px] font-semibold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(d.del_nalc_pur_val)}
                                </span>
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </article>
                </div>
            </section>
            )}
        </div>
    );
};

export default Dashboard;
