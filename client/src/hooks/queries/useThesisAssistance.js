import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The advisor's supervised thesis-assistance records, normalised with id and safe tasks.
export const useThesisAssistance = () => {
    return useQuery({
        queryKey: ['thesis-assistance'],
        queryFn: async () => {
            const res = await axiosInstance.get('/thesis-assistance');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id, tasks: d.tasks || [] }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};
