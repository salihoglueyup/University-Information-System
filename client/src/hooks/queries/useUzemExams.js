import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's online (UZEM) exams, normalised with id.
export const useUzemExams = () => {
    return useQuery({
        queryKey: ['uzem-exams'],
        queryFn: async () => {
            const res = await axiosInstance.get('/uzem-exams');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};
