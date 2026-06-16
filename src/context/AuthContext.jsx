import React, { createContext, useState, useContext } from 'react';
import { storage } from '../utils/storage';


const AuthContext = createContext(null);

const mockUser = {
    userId: 'test-profile',
    userName: 'Vaishali',
    accesslevel: 'admin',
    customerId: 'CUST-001',
    store: {
        customerid: 'CUST-001',
        storename: 'Mock Store'
    }
};

const mockLicense = {
    isValid: true,
    stores: [
        { customerid: 'CUST-001', storename: 'Mock Store' }
    ]
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => storage.getUser() || mockUser);
    const [license, setLicense] = useState(() => storage.getLicense() || mockLicense);
    const loading = false;

    const [rolePermissions, setRolePermissions] = useState({
        admin: ['dashboard', 'controlcentre', 'reports', 'storeexpense', 'inventory', 'massinvoice', 'users', 'masstransfer', 'uploadindent', 'grnalcohol', 'totsales', 'sellingprice', 'cashentry', 'administration', 'masters'],
        store: ['dashboard', 'inventory', 'cashentry', 'reports'],
        developer: ['dashboard', 'controlcentre']
    });

    // Granular permissions for specific actions within modules
    const [actionPermissions, setActionPermissions] = useState({
        admin: { users_edit: true, users_activate: true, reports_audit: true, reports_inventory: true, reports_export: true, inventory_new_movement: true, expense_add_fields: true, admin_allow_user_permissions: true, admin_allow_admin_actions: true, dashboard_view_key_events: true },
        store: { users_edit: false, users_activate: false, reports_audit: false, reports_inventory: true, reports_export: false, inventory_new_movement: false, expense_add_fields: false, dashboard_view_key_events: false },
        developer: { users_edit: false, users_activate: false, reports_audit: false, reports_inventory: false, reports_export: false, inventory_new_movement: false, expense_add_fields: false, dashboard_view_key_events: false }
    });

    const updateActionPermission = (role, actionId, isAllowed) => {
        setActionPermissions(prev => ({
            ...prev,
            [role]: {
                ...(prev[role] || {}),
                [actionId]: isAllowed
            }
        }));
    };

    const updateRolePermission = (role, moduleId, isVisible) => {
        setRolePermissions(prev => {
            const currentModules = prev[role] || [];
            let newModules;
            if (isVisible) {
                // Add if not present
                newModules = currentModules.includes(moduleId) ? currentModules : [...currentModules, moduleId];
            } else {
                // Remove if present
                newModules = currentModules.filter(id => id !== moduleId);
            }
            return { ...prev, [role]: newModules };
        });
    };

    const login = (userData, token = null) => {
        setUser(userData);
        storage.setUser(userData);
        if (token) {
            storage.setToken(token);
        }
    };

    const logout = () => {
        setUser(null);
        storage.clear();
    };

    const saveLicense = (licenseData) => {
        setLicense(licenseData);
        storage.setLicense(licenseData);
    };

    return (
        <AuthContext.Provider value={{ user, license, login, logout, saveLicense, loading, rolePermissions, updateRolePermission, actionPermissions, updateActionPermission }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
