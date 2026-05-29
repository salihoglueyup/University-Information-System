/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { getUser, getToken } from '../utils/authStorage';
import axiosInstance from '../api/axiosInstance';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useMemo(() => {
        return io('/', {
            path: '/socket.io',
            transports: ['polling', 'websocket'],
            withCredentials: true,
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
            timeout: 60000,
            auth: { token: getToken() }
        });
    }, []);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const user = getUser();

        // Only connect when user is authenticated
        if (!user) return;

        if (!socket.connected) {
            socket.connect();
        }

        const registerIdentity = () => {
            try {
                const userId = user?.id || user?._id;
                const username = user?.username;

                if (userId || username) {
                    socket.emit('register_user', { userId, username });
                }
            } catch {
                // Ignore malformed user payload in storage
            }
        };

        socket.on('connect', registerIdentity);

        // General notifications listener
        socket.on('new_announcement', (announcement) => {
            const msg = `Yeni Duyuru: ${announcement.title}`;
            toast.info(msg);
            setNotifications(prev => [{
                id: Date.now(),
                type: 'info',
                message: msg,
                read: false
            }, ...prev]);
        });

        socket.on('new_assignment', (assignment) => {
            const msg = `YENİ ÖDEV: ${assignment.message}`;
            toast.warning(msg);
            setNotifications(prev => [{
                id: Date.now(),
                type: 'warning',
                message: msg,
                read: false
            }, ...prev]);
        });

        socket.on('new_grade', (grade) => {
            toast.success(grade.message);
            setNotifications(prev => [{
                id: Date.now(),
                type: 'success',
                message: grade.message,
                read: false
            }, ...prev]);
        });

        // Our new RabbitMQ notification Consumer channel
        socket.on('new_notification', (data) => {
            const toastContent = (
                <div>
                    <strong className="block text-sm">{data.title || 'Sistem Bildirimi'}</strong>
                    <span className="text-xs">{data.message}</span>
                </div>
            );
            if (data.type === 'error') toast.error(toastContent);
            else if (data.type === 'success') toast.success(toastContent);
            else toast.info(toastContent);

            setNotifications(prev => [{
                id: Date.now(),
                type: data.type || 'info',
                message: data.message,
                title: data.title,
                read: false
            }, ...prev]);
        });

        return () => {
            socket.off('connect', registerIdentity);
            socket.off('new_announcement');
            socket.off('new_assignment');
            socket.off('new_grade');
            socket.off('new_notification');
            socket.close();
        };
    }, [socket]);

    // Load notifications persisted while the user was offline.
    useEffect(() => {
        if (!getUser()) return;
        let cancelled = false;
        axiosInstance.get('/notifications')
            .then(res => {
                if (cancelled || !Array.isArray(res.data)) return;
                const persisted = res.data.map(n => ({
                    id: n._id,
                    type: n.type || 'info',
                    title: n.title,
                    message: n.message,
                    read: Boolean(n.read)
                }));
                // Keep any already-received live notifications on top.
                setNotifications(prev => [...prev, ...persisted]);
            })
            .catch(() => { /* notifications are best-effort */ });
        return () => { cancelled = true; };
    }, []);

    const markAsRead = useCallback((id) => {
        setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif));
        // Persist read state (no-op for live, non-DB ids).
        axiosInstance.patch(`/notifications/${id}/read`).catch(() => {});
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
        axiosInstance.patch('/notifications/read-all').catch(() => {});
    }, []);

    const contextValue = useMemo(() => ({
        socket, notifications, markAsRead, markAllAsRead
    }), [socket, notifications, markAsRead, markAllAsRead]);

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
};
