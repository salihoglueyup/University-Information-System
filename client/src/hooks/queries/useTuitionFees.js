import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's term tuition fees, normalised with id.
export const useTuitionFees = () => {
    return useQuery({
        queryKey: ['tuition-fees'],
        queryFn: async () => {
            const res = await axiosInstance.get('/tuition-fees');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const usePayTuition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const res = await axiosInstance.patch(`/tuition-fees/${id}/pay`);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tuition-fees'] }),
    });
};
