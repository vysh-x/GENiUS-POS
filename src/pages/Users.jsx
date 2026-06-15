import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { elements } from '../theme/elements';
import { useNotification } from '../context/NotificationContext';
import { ModalShell, PageHeader } from '../components/ui';
import { Download, Lock, Edit, Trash, Check, Plus, Search, X, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';

const mockUsers = [
    { id: 1, user_id: '101', user_name: 'Vaishali', shop_id: 'madurai', user_type: 'admin', user_email: 'vaishali@test.com', created_at: Date.now() - 100000000, status: 'active' },
    { id: 2, user_id: '102', user_name: 'Store Manager', shop_id: 'madurai', user_type: 'store', user_email: 'manager@test.com', created_at: Date.now() - 50000000, status: 'active' },
    { id: 3, user_id: '103', user_name: 'Tech Support', shop_id: 'madurai', user_type: 'developer', user_email: 'tech@test.com', created_at: Date.now() - 20000000, status: 'active' },
    { id: 4, user_id: '104', user_name: 'Staff Member', shop_id: 'madurai', user_type: 'store', user_email: 'staff@test.com', created_at: Date.now() - 10000000, status: 'inactive' },
    { id: 5, user_id: '105', user_name: 'Chennai Manager', shop_id: 'chennai', user_type: 'store', user_email: 'chennai@test.com', created_at: Date.now() - 80000000, status: 'active' },
    { id: 6, user_id: '106', user_name: 'Samyu', shop_id: 'madurai', user_type: 'store', user_email: 'samyu@test.com', created_at: Date.now() - 30000000, status: 'active' }
];

const mockShopsMap = {
    'madurai': 'Madurai Store',
    'chennai': 'Chennai Store'
};

const Users = () => {
    const { user, actionPermissions } = useAuth();
    const notify = useNotification();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    
    const isAdmin = user?.accesslevel === 'admin';
    const canEdit = actionPermissions[user?.accesslevel]?.users_edit || false;
    const canActivate = actionPermissions[user?.accesslevel]?.users_activate || false;

    const saveUsers = (newUsers) => {
        setUsers(newUsers);
        localStorage.setItem('carture_mock_users', JSON.stringify(newUsers));
    };

    useEffect(() => {
        // Load mock static data from localStorage, fallback to mockUsers
        const saved = localStorage.getItem('carture_mock_users');
        if (saved) {
            setUsers(JSON.parse(saved));
        } else {
            saveUsers(mockUsers);
        }
    }, []);

    // Filter Users
    const filteredUsers = users.filter(u => {
        if (!isAdmin && u.user_type === 'admin') return false; // Hide admins from non-admins
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        return (
            (u.user_name && u.user_name.toLowerCase().includes(s)) ||
            (u.user_type && u.user_type.toLowerCase().includes(s)) ||
            (u.user_email && u.user_email.toLowerCase().includes(s))
        );
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (sortOrder === 'newest') return b.created_at - a.created_at;
        if (sortOrder === 'oldest') return a.created_at - b.created_at;
        if (sortOrder === 'az') return a.user_name.localeCompare(b.user_name);
        if (sortOrder === 'za') return b.user_name.localeCompare(a.user_name);
        return 0;
    });

    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleActiveToggle = (id) => {
        const updated = users.map(u => {
            if (u.id === id) {
                return { ...u, status: u.status === 'active' ? 'inactive' : 'active' };
            }
            return u;
        });
        saveUsers(updated);
    };

    const handleAddUserSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newUser = {
            id: Date.now(), // Unique ID
            user_id: String(Date.now()).slice(-4), // Mock User ID
            user_name: formData.get('userName'),
            shop_id: formData.get('shopId'),
            user_type: formData.get('userType'),
            user_email: formData.get('userEmail'),
            created_at: Date.now(),
            status: 'active'
        };

        saveUsers([newUser, ...users]); // Add to top of list and save
        setShowAddModal(false);
    };

    const openEditModal = (u) => {
        setSelectedUser({ ...u });
        setShowEditModal(true);
    };

    const handleEditSave = () => {
        const updated = users.map(u => u.id === selectedUser.id ? selectedUser : u);
        saveUsers(updated);
        setShowEditModal(false);
    };

    return (
        <div className={elements.pageContainer}>
            <PageHeader
                icon={UserIcon}
                title="User Management"
                subtitle="Manage staff accounts, roles, and permissions"
                iconClassName="w-13 h-13 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-lg shadow-blue-600/30"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                    <div className="relative w-full sm:w-72">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users by name, role, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow"
                        />
                    </div>
                    <select 
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className={`${elements.selectInput} w-full sm:w-auto`}
                    >
                        <option value="newest">Recently Added</option>
                        <option value="oldest">Oldest First</option>
                        <option value="az">A to Z</option>
                        <option value="za">Z to A</option>
                    </select>
                </div>
                {isAdmin && (
                    <button onClick={() => setShowAddModal(true)} className={elements.primaryButton}>
                        <Plus className="w-5 h-5" />
                        Add New User
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Name</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Role</th>
                                {isAdmin && <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Store</th>}
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Email</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                            {paginatedUsers.length > 0 ? paginatedUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs uppercase">
                                                {u.user_name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">{u.user_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium uppercase tracking-wider">
                                            {u.user_type}
                                        </span>
                                    </td>
                                    {isAdmin && <td className="px-6 py-4 text-gray-500">{mockShopsMap[u.shop_id] || u.shop_id}</td>}
                                    <td className="px-6 py-4 text-gray-500">{u.user_email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            u.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className={elements.iconButton} title="Change Password" onClick={() => { setSelectedUser(u); setShowPasswordModal(true); }}>
                                            <Lock size={16} />
                                        </button>
                                        
                                        {canEdit && (
                                            <button onClick={() => openEditModal(u)} className={elements.iconButton} title="Edit User">
                                                <Edit size={16} />
                                            </button>
                                        )}
                                        {canActivate && (
                                            u.status === 'active' ? (
                                                <button onClick={() => handleActiveToggle(u.id)} className={`${elements.iconButton} text-red-500 hover:text-red-600 hover:bg-red-50`} title="Deactivate">
                                                    <Trash size={16} />
                                                </button>
                                            ) : (
                                                <button onClick={() => handleActiveToggle(u.id)} className={`${elements.iconButton} text-green-500 hover:text-green-600 hover:bg-green-50`} title="Activate">
                                                    <Check size={16} />
                                                </button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <UserIcon size={32} className="text-gray-300 mb-2" />
                                            <p>No users found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="bg-gray-50/50 dark:bg-gray-900/30 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredUsers.length}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors">
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-sm font-medium px-2">{currentPage} / {totalPages}</span>
                            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Static Add User Modal */}
            {showAddModal && (
                <ModalShell>
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700/50">
                            <h2 className="text-xl font-bold">Add New User</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">User Name</label>
                                <input type="text" name="userName" required className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" name="userEmail" required className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Role</label>
                                    <select name="userType" required className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="store">Store</option>
                                        <option value="developer">Developer</option>
                                        {isAdmin && <option value="admin">Admin</option>}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Store</label>
                                    <select name="shopId" required className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                                        {Object.entries(mockShopsMap).map(([id, name]) => (
                                            <option key={id} value={id}>{name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors text-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                                    Create User
                                </button>
                            </div>
                        </form>
                </ModalShell>
            )}

            {/* Static Edit User Modal */}
            {showEditModal && selectedUser && (
                <ModalShell>
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700/50">
                            <h2 className="text-xl font-bold">Edit User Role</h2>
                            <button onClick={() => setShowEditModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">User Name</label>
                                <input type="text" readOnly className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 rounded cursor-not-allowed" value={selectedUser.user_name} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">User Type / Role</label>
                                <select 
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={selectedUser.user_type} 
                                    onChange={e => setSelectedUser({...selectedUser, user_type: e.target.value})}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="store">Store</option>
                                    <option value="developer">Developer</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors text-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</button>
                                <button onClick={handleEditSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Save Changes</button>
                            </div>
                        </div>
                </ModalShell>
            )}

            {showPasswordModal && selectedUser && (
                <ModalShell>
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700/50">
                            <h2 className="text-xl font-bold">Change Password</h2>
                            <button onClick={() => setShowPasswordModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">User Name</label>
                                <input type="text" readOnly className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 rounded cursor-not-allowed" value={selectedUser.user_name} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">New Password</label>
                                <input type="password" placeholder="Enter new password" required className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors text-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</button>
                                <button onClick={() => { notify.notification('Password changed successfully', 'success'); setShowPasswordModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Save Password</button>
                            </div>
                        </div>
                </ModalShell>
            )}
        </div>
    );
};

export default Users;
