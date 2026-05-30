import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The department curriculum catalog, normalised with id.
export const useDepartmentCourses = () => {
    return useQuery({
        queryKey: ['department-courses'],
        queryFn: async () => {
            const res = await axiosInstance.get('/department-courses');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
