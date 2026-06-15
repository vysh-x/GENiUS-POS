import React, { useState, useRef, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { elements } from '../theme/elements';
import { PageHeader } from '../components/ui';
import {
    Upload,
    FileText,
    Trash2,
    Loader2,
    AlertCircle,
    Search,
    History
} from 'lucide-react';
import Swal from '../utils/tempSwal';

const staticInitialIndents = [
    { indno: 'IND-2026-001', extra: { cnfcb: 10, cnfcbtl: 120, cnfamt: 45000 } },
    { indno: 'IND-2026-002', extra: { cnfcb: 5, cnfcbtl: 60, cnfamt: 22500 } },
    { indno: 'IND-2026-003', extra: { cnfcb: 15, cnfcbtl: 180, cnfamt: 68000 } },
];

const UploadIndent = () => {
    const { notification } = useNotification();

    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [indents, setIndents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef(null);

    // Initialize with static mock data
    useEffect(() => {
        setIsLoading(true);
        // Simulate network delay
        setTimeout(() => {
            setIndents(staticInitialIndents);
            setIsLoading(false);
        }, 600);
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
                setFile(selectedFile);
            } else {
                notification('Please select a valid CSV file', 'warning');
                if (fileInputRef.current) fileInputRef.current.value = '';
                setFile(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            notification('Please select a file first', 'info');
            return;
        }

        setIsUploading(true);
        // Simulate upload delay
        setTimeout(() => {
            const newIndent = {
                indno: `IND-2026-00${Math.floor(Math.random() * 10) + 4}`,
                extra: { 
                    cnfcb: Math.floor(Math.random() * 20) + 1, 
                    cnfcbtl: Math.floor(Math.random() * 200) + 20, 
                    cnfamt: Math.floor(Math.random() * 100000) + 5000 
                }
            };
            setIndents([newIndent, ...indents]);
            notification('File uploaded and processed successfully!', 'success');
            
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            setIsUploading(false);
        }, 1500);
    };

    const handleDelete = async (indno) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete indent ${indno}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            setIndents(indents.filter(i => i.indno !== indno));
            notification(`${indno} deleted successfully`, 'success');
        }
    };

    const filteredIndents = indents.filter(indent =>
        indent.indno?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={elements.pageContainer}>
            <PageHeader
                icon={Upload}
                title="Upload Indent"
                subtitle="Process and manage your indent CSV files"
                iconClassName="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-600/30"
                actions={(
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <button
                            onClick={() => {
                                setIsLoading(true);
                                setTimeout(() => setIsLoading(false), 800);
                            }}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-xl transition-colors text-sm font-medium shadow-sm disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <History size={18} />}
                            Sync Indents
                        </button>
                    </div>
                )}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className={elements.card}>
                        <div className={elements.cardHeader}>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <Upload size={18} className="text-indigo-500" />
                                Upload CSV
                            </h3>
                        </div>
                        <div className={`${elements.cardBody} space-y-4`}>
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${file ? 'border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                            >
                                <input
                                    type="file"
                                    id="grn-indent-file"
                                    className="hidden"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                />

                                <label htmlFor="grn-indent-file" className="cursor-pointer flex flex-col items-center text-center w-full">
                                    {file ? (
                                        <>
                                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
                                                <FileText size={24} className="text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <p className="text-sm font-medium truncate max-w-full text-gray-900 dark:text-white px-4">{file.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-105">
                                                <Upload size={24} className="text-gray-500 dark:text-gray-400" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Click to select CSV</p>
                                            <p className="text-xs text-gray-500 mt-1">Supported formats: .csv only</p>
                                        </>
                                    )}
                                </label>
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={!file || isUploading}
                                className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm ${!file || isUploading ? 'bg-gray-100 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25 active:scale-[0.98]'}`}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        Upload Indent
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl flex gap-3 text-amber-800 dark:text-amber-400 text-sm shadow-sm">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold mb-1">Standard Format Required</p>
                            <p className="opacity-90 leading-relaxed">Ensure your CSV follows the standard indent format before uploading to prevent data parsing errors.</p>
                        </div>
                    </div>
                </div>

                {/* Pending Indents Table */}
                <div className="lg:col-span-2">
                    <div className={`${elements.card} h-full flex flex-col`}>
                        <div className={`${elements.cardHeader} flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700/50`}>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <FileText size={18} className="text-indigo-500" />
                                Pending Indents
                                {indents.length > 0 && (
                                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs px-2.5 py-0.5 rounded-full font-semibold ml-2">
                                        {indents.length}
                                    </span>
                                )}
                            </h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search indent no..."
                                    className={`${elements.input} pl-10 py-2 text-sm w-full md:w-64`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center p-20 text-gray-500">
                                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                                    <p className="animate-pulse font-medium">Syncing indents...</p>
                                </div>
                            ) : filteredIndents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-20 text-gray-500">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                                        <History size={32} className="text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-300">{searchTerm ? 'No matching indents found' : 'No pending indents'}</p>
                                    <p className="text-sm mt-1">Uploaded indents will appear here automatically.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700/50">
                                            <th className="px-6 py-4">S.No</th>
                                            <th className="px-6 py-4">Indent No.</th>
                                            <th className="px-6 py-4 text-center">Cases</th>
                                            <th className="px-6 py-4 text-center">Bottles</th>
                                            <th className="px-6 py-4 text-right">Amount</th>
                                            <th className="px-6 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800/50">
                                        {filteredIndents.map((indent, index) => (
                                            <tr key={indent.indno} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">{index + 1}</td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{indent.indno}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {indent.extra?.cnfcb || 0}
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {indent.extra?.cnfcbtl || 0}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                                        ₹{(indent.extra?.cnfamt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleDelete(indent.indno)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all active:scale-95"
                                                        title="Delete indent"
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
                </div>
            </div>
        </div>
    );
};

export default UploadIndent;
