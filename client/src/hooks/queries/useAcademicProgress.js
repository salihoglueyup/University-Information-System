import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's academic-progress record (program/stage/credits + milestones + publications).
export const useAcademicProgress = () => {
    return useQuery({
        queryKey: ['academic-progress'],
        queryFn: async () => (await axiosInstance.get('/academic-progress')).data,
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useAddPublication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosInstance.post('/academic-progress/publications', payload);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['academic-progress'] }),
    });
};
