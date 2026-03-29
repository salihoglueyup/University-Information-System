/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { API_URL } from '../config/apiConfig';
import { getUser } from '../utils/authStorage';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io(API_URL.replace('/api', ''), {
        transports: ['websocket', 'polling']
    }), []);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const registerIdentity = () => {
            try {
                const user = getUser();
                if (!user) return;
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
            socket.close();
        };
    }, [socket]);

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif));
    };

    return (
        <SocketContext.Provider value={{ socket, notifications, markAsRead }}>
            {children}
        </SocketContext.Provider>
    );
};
