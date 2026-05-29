import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Weekly cafeteria menu.
export const useDiningMenu = () => {
    return useQuery({
        queryKey: ['dining-menu'],
        queryFn: async () => {
            const res = await axiosInstance.get('/dining-menu');
            return Array.isArray(res.data) ? res.data : [];
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export default useDiningMenu;
