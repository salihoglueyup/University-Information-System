import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The weekly syllabus for a given catalog course, normalised with id.
export const useSyllabus = (courseId) => {
    return useQuery({
        queryKey: ['syllabus', courseId],
        queryFn: async () => {
            const res = await axiosInstance.get('/syllabus', { params: { courseId } });
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        enabled: !!courseId,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
