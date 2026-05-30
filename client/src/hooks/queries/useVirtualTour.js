import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The 360° campus virtual-tour spots, normalised with id.
export const useVirtualTour = () => {
    return useQuery({
        queryKey: ['virtual-tour'],
        queryFn: async () => {
            const res = await axiosInstance.get('/virtual-tour');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
