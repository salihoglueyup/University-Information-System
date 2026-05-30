import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's academic publications, normalised with id.
export const usePublications = () => {
    return useQuery({
        queryKey: ['publications'],
        queryFn: async () => {
            const res = await axiosInstance.get('/publications');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};
