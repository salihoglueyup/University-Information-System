import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The library/info-center electronic resources, normalised with id.
export const useInfoResources = () => {
    return useQuery({
        queryKey: ['info-resources'],
        queryFn: async () => {
            const res = await axiosInstance.get('/info-resources');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
