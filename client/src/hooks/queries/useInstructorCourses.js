import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The courses the current instructor teaches this term, normalised with id.
export const useInstructorCourses = () => {
    return useQuery({
        queryKey: ['instructor-courses'],
        queryFn: async () => {
            const res = await axiosInstance.get('/instructor-courses');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};
