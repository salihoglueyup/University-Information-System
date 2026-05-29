import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Weekly schedule entries for the signed-in user ({ course, day, start, end, room, ... }).
export const useSchedule = () => {
    return useQuery({
        queryKey: ['schedule'],
        queryFn: async () => {
            const res = await axiosInstance.get('/schedule');
            return Array.isArray(res.data) ? res.data : [];
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export default useSchedule;
