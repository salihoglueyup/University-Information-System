import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Job / internship listings.
export const useJobPostings = () => {
    return useQuery({
        queryKey: ['jobs'],
        queryFn: async () => {
            const res = await axiosInstance.get('/jobs');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export default useJobPostings;
