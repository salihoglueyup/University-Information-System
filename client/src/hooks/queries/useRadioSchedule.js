import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The university radio/TV broadcast schedule, normalised with id.
export const useRadioSchedule = () => {
    return useQuery({
        queryKey: ['radio-schedule'],
        queryFn: async () => {
            const res = await axiosInstance.get('/radio-schedule');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
