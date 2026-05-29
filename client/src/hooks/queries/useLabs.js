import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Lab sections the user (instructor) is responsible for.
export const useLabs = () => {
    return useQuery({
        queryKey: ['labs'],
        queryFn: async () => {
            const res = await axiosInstance.get('/labs');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export default useLabs;
