import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's exam proctoring duties, normalised with id.
export const useProctoringDuties = () => {
    return useQuery({
        queryKey: ['proctoring'],
        queryFn: async () => {
            const res = await axiosInstance.get('/proctoring');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useConfirmDuty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const res = await axiosInstance.patch(`/proctoring/${id}/confirm`);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proctoring'] }),
    });
};
