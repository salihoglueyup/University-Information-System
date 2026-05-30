import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's official transcript rows, normalised with id.
export const useTranscript = () => {
    return useQuery({
        queryKey: ['transcript'],
        queryFn: async () => {
            const res = await axiosInstance.get('/transcript');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
