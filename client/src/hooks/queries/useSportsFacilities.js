import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Campus sports facilities with live occupancy, normalised with id.
export const useSportsFacilities = () => {
    return useQuery({
        queryKey: ['sports-facilities'],
        queryFn: async () => {
            const res = await axiosInstance.get('/sports-facilities');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};
