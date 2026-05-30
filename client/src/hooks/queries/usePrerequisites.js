import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The course prerequisite catalog, normalised with id and a safe array.
export const usePrerequisites = () => {
    return useQuery({
        queryKey: ['prerequisites'],
        queryFn: async () => {
            const res = await axiosInstance.get('/prerequisites');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id, prerequisites: d.prerequisites || [] }));
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
