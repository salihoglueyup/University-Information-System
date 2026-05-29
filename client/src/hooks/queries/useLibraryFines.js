import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's library fines (paid + unpaid), normalised with id.
export const useLibraryFines = () => {
    return useQuery({
        queryKey: ['library-fines'],
        queryFn: async () => {
            const res = await axiosInstance.get('/library-fines');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const usePayFine = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const res = await axiosInstance.patch(`/library-fines/${id}/pay`);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library-fines'] }),
    });
};
