import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const mapId = (arr) => (Array.isArray(arr) ? arr.map(d => ({ ...d, id: d._id })) : []);

export const useErasmusApplications = () => useQuery({
    queryKey: ['erasmus-applications'],
    queryFn: async () => mapId((await axiosInstance.get('/erasmus')).data),
    staleTime: 60 * 1000,
    retry: 1,
});

export const useCreateErasmusApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => (await axiosInstance.post('/erasmus', payload)).data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['erasmus-applications'] }),
    });
};

export const useErasmusChoices = () => useQuery({
    queryKey: ['erasmus-choices'],
    queryFn: async () => mapId((await axiosInstance.get('/erasmus/choices')).data),
    staleTime: 60 * 1000,
    retry: 1,
});

export const useCreateErasmusChoice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => (await axiosInstance.post('/erasmus/choices', payload)).data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['erasmus-choices'] }),
    });
};
