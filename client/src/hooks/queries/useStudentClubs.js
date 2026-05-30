import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The student-club catalog, normalised with id.
export const useStudentClubs = () => {
    return useQuery({
        queryKey: ['student-clubs'],
        queryFn: async () => {
            const res = await axiosInstance.get('/student-clubs');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export const useJoinClub = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const res = await axiosInstance.post(`/student-clubs/${id}/join`);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['student-clubs'] }),
    });
};
