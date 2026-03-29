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

export const isAuthenticated = () => Boolean(getUser() && getToken());

export const setAuthSession = (user, token) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthSession = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
};
