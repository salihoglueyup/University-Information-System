import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's e-exam appointments, normalised with id.
export const useElectronicExams = () => {
    return useQuery({
        queryKey: ['electronic-exams'],
        queryFn: async () => {
            const res = await axiosInstance.get('/electronic-exams');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};
