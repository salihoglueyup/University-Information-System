import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export function useEnrolledCourses() {
    return useQuery({
        queryKey: ['enrolledCourses'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/courses');
            return data;
        },
        staleTime: 5 * 60 * 1000,
    });
}
