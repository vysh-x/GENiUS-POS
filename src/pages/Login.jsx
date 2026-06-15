import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import ThemeToggle from '../components/ThemeToggle';
import { AuthPanel } from '../components/ui';
import { Loader2, ChevronDown, ArrowLeft } from 'lucide-react';
import { elements } from '../theme/elements';

const Login = () => {
    const { license, login } = useAuth();
    const { notification } = useNotification();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedStore, setSelectedStore] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!license) {
            navigate('/license');
            return;
        }

        if (license.stores && license.stores.length === 1) {
            setSelectedStore(license.stores[0].customerid);
        } else if (license.stores && license.stores.length > 0) {
            setSelectedStore(license.stores[0].customerid);
        }
    }, [license, navigate]);

    const handleBack = () => {
        // Remove the stored license
        localStorage.removeItem('wob_license');
        // Navigate back to license page
        navigate('/license');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const uName = username.toLowerCase();
            const isValidVaishali = (uName === 'vaishali' || uName === '9443355034') && password === 'test';
            const isValidSamyu = uName === 'samyu' && password === 'sam';

            if (isValidVaishali || isValidSamyu) {
                // Generate a static mock user for the portfolio
                const mockUser = isValidVaishali ? {
                    userId: 1,
                    name: 'Vaishali',
                    mobile_number: '9443355034',
                    accesslevel: 'admin',
                    isVerifiedMdm: true
                } : {
                    userId: 2,
                    name: 'Samyu',
                    mobile_number: '9876543210',
                    accesslevel: 'store',
                    isVerifiedMdm: false
                };

                const store = license.stores.find(s => s.customerid === selectedStore);
                const authToken = 'static-portfolio-token-12345';

                login({ ...mockUser, store, customerId: selectedStore }, authToken);
                notification('Login successful', 'success');
                navigate('/');
            } else {
                notification('Invalid credentials. Please try again.', 'error');
            }
        } catch {
            notification('Login failed. Please check your credentials.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!license) return null;

    const getStoreName = () => {
        if (!selectedStore) return '';
        const store = license.stores.find(s => s.customerid === selectedStore);
        return store ? store.storename : '';
    };

    return (
        <div className={`${elements.container} relative`}>
            <div className={elements.themeToggleWrapper}>
                <ThemeToggle />
            </div>

            {/* Modal Container */}
            <AuthPanel className={`${elements.modalWrapper} p-8 flex flex-col justify-center`}>
                {/* Welcome Header */}
                <div className="text-center mb-6 pt-2">
                    <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome to GENiUS POS</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {getStoreName() || 'Store Login'}
                    </p>
                </div>

                {/* Form fields directly inside modal */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {license.stores && license.stores.length > 1 && (
                        <div className="relative">
                            <select
                                value={selectedStore}
                                onChange={(e) => setSelectedStore(e.target.value)}
                                className={`${elements.input} cursor-pointer appearance-none pr-10`}
                            >
                                {license.stores.map((store) => (
                                    <option key={store.customerid} value={store.customerid}>
                                        {store.storename}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                        </div>
                    )}

                    <div className={elements.inputWrapper}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={elements.input}
                            placeholder="Username"
                            required
                        />
                    </div>

                    <div className={elements.inputWrapper}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={elements.input}
                            placeholder="Password"
                            required
                        />
                    </div>

                    <div className={elements.buttonWrapper}>
                        <button
                            type="submit"
                            disabled={loading}
                            className={elements.button}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Signing in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                </form>
            </AuthPanel>
        </div>
    );
};

export default Login;
