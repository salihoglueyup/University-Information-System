import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The advisor's supervised thesis students, normalised with id.
export const useThesisStudents = () => {
    return useQuery({
        queryKey: ['thesis-students'],
        queryFn: async () => {
            const res = await axiosInstance.get('/thesis-students');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};
