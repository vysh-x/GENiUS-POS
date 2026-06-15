import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { decryptData } from '../utils/storage';
import { filterAlphanumeric } from '../utils/validators';
import ThemeToggle from '../components/ThemeToggle';
import { AuthPanel } from '../components/ui';
import { Loader2 } from 'lucide-react';
import { elements } from '../theme/elements';

const LicenseVerify = () => {
    const [licenseKey, setLicenseKey] = useState('');
    const [loading, setLoading] = useState(false);
    const { saveLicense } = useAuth();
    const { notification } = useNotification();
    const navigate = useNavigate();

    const verificationRun = React.useRef(false);

    const verifyLicense = useCallback(async (key) => {
        setLoading(true);
        try {
            // Simulate network delay for a realistic loading state
            await new Promise(resolve => setTimeout(resolve, 800));

            if (key === 'VAISHALI') {
                // Provide some mock store data for the rest of the app
                const mockStores = [
                    { customerid: 'store-madurai', storename: 'Madurai store' },
                    { customerid: 'store-chennai', storename: 'Chennai store' }
                ];
                saveLicense({ key: key, stores: mockStores });
                notification('License verified successfully', 'success');
                navigate('/login');
            } else {
                notification('Invalid license key. Hint: Try "VAISHALI"', 'error');
            }
        } catch {
            notification('Failed to verify license. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    }, [navigate, notification, saveLicense]);

    useEffect(() => {
        const checkStoredLicense = async () => {
            if (verificationRun.current) return;
            verificationRun.current = true;

            const storedLicense = localStorage.getItem('wob_license');
            if (storedLicense) {
                const decrypted = decryptData(storedLicense);

                if (decrypted && decrypted.key) {
                    setLicenseKey(decrypted.key);
                    verifyLicense(decrypted.key);
                }
            }
        };
        checkStoredLicense();
    }, [verifyLicense]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        const filtered = filterAlphanumeric(value);
        setLicenseKey(filtered);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await verifyLicense(licenseKey);
    };

    return (
        <div className={elements.container}>
            <div className={elements.themeToggleWrapper}>
                <ThemeToggle />
            </div>

            {/* Modal Container */}
            <AuthPanel>
                <div className={elements.headerTitle}>
                    <h3>Welcome to GENiUS POS</h3>
                </div>

                <div className={elements.card}>
                    {/* Modal Header */}
                    <div className={elements.cardHeader}>
                        <h2 className={elements.cardTitle}>
                            License Verification
                        </h2>
                    </div>

                    {/* Modal Body */}
                    <div className={elements.cardBody}>
                        <form onSubmit={handleSubmit} className={elements.formSpacing}>
                            <div className={elements.inputWrapper}>
                                <input
                                    id="license"
                                    type="text"
                                    value={licenseKey}
                                    onChange={handleInputChange}
                                    maxLength={30}
                                    className={elements.input}
                                    placeholder="Enter License Key"
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
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </AuthPanel>
        </div>
    );
};

export default LicenseVerify;
