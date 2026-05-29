import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Campus events listing.
export const useEvents = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const res = await axiosInstance.get('/events');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export default useEvents;
