import CryptoJS from 'crypto-js';

const SECRET_KEY = 'carture-static-demo-key';

export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
        return null;
    }
};

export const storage = {
    setLicense: (licenseData) => {
        const encrypted = encryptData(licenseData);
        localStorage.setItem('wob_license', encrypted);
    },
    getLicense: () => {
        const encrypted = localStorage.getItem('wob_license');
        if (!encrypted) return null;
        return decryptData(encrypted);
    },
    setToken: (token) => {
        localStorage.setItem('wob_token', token);
    },
    getToken: () => {
        return localStorage.getItem('wob_token');
    },
    setUser: (user) => {
        const encrypted = encryptData(user);
        localStorage.setItem('wob_user', encrypted);
    },
    getUser: () => {
        const encrypted = localStorage.getItem('wob_user');
        if (!encrypted) return null;
        return decryptData(encrypted);
    },
    clear: () => {
        // We preserve 'wob_license' so the app stays activated (deviceId remains)
        localStorage.removeItem('wob_token');
        localStorage.removeItem('wob_user');
    }
};
