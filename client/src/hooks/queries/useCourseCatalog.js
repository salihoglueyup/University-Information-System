import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The institution-wide course catalog, normalised with id (keeps code).
export const useCourseCatalog = () => {
    return useQuery({
        queryKey: ['course-catalog'],
        queryFn: async () => {
            const res = await axiosInstance.get('/course-catalog');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
