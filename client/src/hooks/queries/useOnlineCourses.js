import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's online (UZEM/Moodle) courses, normalised with id.
export const useOnlineCourses = () => {
    return useQuery({
        queryKey: ['online-courses'],
        queryFn: async () => {
            const res = await axiosInstance.get('/online-courses');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};
