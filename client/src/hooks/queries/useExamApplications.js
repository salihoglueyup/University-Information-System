import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The available special-exam catalog, normalised with id.
export const useExamApplications = () => {
    return useQuery({
        queryKey: ['exam-applications'],
        queryFn: async () => {
            const res = await axiosInstance.get('/exam-applications');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export const useApplyExam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const res = await axiosInstance.post(`/exam-applications/${id}/apply`);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['exam-applications'] }),
    });
};
