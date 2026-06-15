export const elements = {
    // Layout and Background
    layoutContainer: "min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 flex flex-col",
    topBar: "bg-white dark:bg-gray-800 shadow-sm z-20 h-16 flex items-center justify-between px-4 transition-colors duration-200 fixed w-full top-0 left-0",
    container: "min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200 font-sans",
    themeToggleWrapper: "absolute top-4 right-4",
    modalOverlay: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
    modalWrapper: "bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700",
    
    // Typography
    headerTitle: "text-2xl font-medium text-gray-700 dark:text-gray-200 text-center mb-6 mt-4",
    headerSubtitle: "text-sm text-gray-500 dark:text-gray-400 mt-1",
    cardTitle: "text-xl font-semibold text-center text-gray-800 dark:text-white",
    
    // Card Elements
    card: "bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden",
    cardHeader: "px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
    cardBody: "p-6",
    
    // Form and Inputs
    formSpacing: "space-y-6",
    inputWrapper: "space-y-4 relative",
    input: "w-full px-4 py-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors outline-none placeholder-gray-400",
    selectInput: "w-full px-4 py-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors outline-none",
    
    // Button
    buttonWrapper: "pt-2",
    button: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed",
    
    // Icons & Actions
    backButtonWrapper: "absolute top-4 left-4",
    iconButton: "p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
    
    // Dashboard Specific
    pageContainer: "max-w-7xl mx-auto p-4 md:p-6 lg:p-8",
    pageHeader: "flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-gray-200 dark:border-gray-700 gap-4",
    sectionTitle: "text-base font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-5 pl-1",
    grid4Col: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5",
    grid3Col: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
    grid2Col: "grid grid-cols-1 md:grid-cols-2 gap-5",
    
    // Stat Cards
    statCard: "bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-5 relative transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:shadow-none hover:border-gray-300 dark:hover:border-gray-600 group",
    statHeader: "flex justify-between items-center mb-4",
    statTitle: "text-[15px] font-semibold text-gray-900 dark:text-white",
    statSubtitle: "text-[13px] font-medium text-gray-500 dark:text-gray-400 mb-2",
    statValue: "font-mono text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white",
    statValueBlue: "font-mono text-2xl md:text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400",
    statValueRed: "font-mono text-2xl md:text-3xl font-bold tracking-tight text-red-600 dark:text-red-400",
    statValuePurple: "font-mono text-2xl md:text-3xl font-bold tracking-tight text-purple-600 dark:text-purple-400"
};
