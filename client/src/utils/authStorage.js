const USER_KEY = 'user';
const TOKEN_KEY = 'token';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';

export const getUser = () => {
    const rawUser = localStorage.getItem(USER_KEY);
    if (!rawUser) return null;

    try {
        return JSON.parse(rawUser);
    } catch {
        return null;
    }
};

export const getUserRole = () => getUser()?.role || 'student';

// The JWT now lives in an httpOnly cookie (not readable by JS), so the client
// considers itself authenticated based on the stored user object alone.
export const isAuthenticated = () => Boolean(getUser());

export const setAuthSession = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // Never persist the token in localStorage (XSS-readable). The server sets it
    // as an httpOnly cookie. Purge any token stored by older versions.
    localStorage.removeItem(TOKEN_KEY);
};

export const clearAuthSession = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
};
