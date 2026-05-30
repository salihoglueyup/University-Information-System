import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's exam question bank, normalised with id.
export const useQuestions = () => {
    return useQuery({
        queryKey: ['questions'],
        queryFn: async () => {
            const res = await axiosInstance.get('/questions');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useCreateQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosInstance.post('/questions', payload);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] }),
    });
};

export const useDeleteQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await axiosInstance.delete(`/questions/${id}`);
            return id;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] }),
    });
};
