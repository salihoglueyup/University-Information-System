import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Current user's scholarships & applications (normalised with id).
export const useScholarships = () => {
    return useQuery({
        queryKey: ['scholarships'],
        queryFn: async () => {
            const res = await axiosInstance.get('/scholarships');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useApplyScholarship = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosInstance.post('/scholarships', payload);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scholarships'] }),
    });
};
