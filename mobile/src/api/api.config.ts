import Constants from 'expo-constants';

// URL pour les endpoints /auth
export const getAuthBaseURL = () => {
    if (Constants.manifest2?.extra?.expoGoDebugHost) {
        return `http://${Constants.manifest2.extra.expoGoDebugHost}:3000/auth`;
    }
    if (Constants.manifest?.debuggerHost) {
        const host = Constants.manifest.debuggerHost.split(':').shift();
        return `http://${host}:3000/auth`;
    }
    // Fallback par défaut
    return 'http://192.168.1.84:3000/auth'; // Remplace par ton IP locale si nécessaire
};

// URL pour les autres endpoints
export const getBaseURL = () => {
    if (Constants.manifest2?.extra?.expoGoDebugHost) {
        return `http://${Constants.manifest2.extra.expoGoDebugHost}:3000/api`;
    }
    if (Constants.manifest?.debuggerHost) {
        const host = Constants.manifest.debuggerHost.split(':').shift();
        return `http://${host}:3000/api`;
    }
    // Fallback par défaut
    return 'http://192.168.1.84:3000/api'; // Remplace par ton IP locale si nécessaire
};
