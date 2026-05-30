import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Campus shuttle (ring) routes and times, normalised with id and a safe array.
export const useShuttle = () => {
    return useQuery({
        queryKey: ['shuttle'],
        queryFn: async () => {
            const res = await axiosInstance.get('/shuttle');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id, times: d.times || [] }));
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
