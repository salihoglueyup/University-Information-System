import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export const useCourses = () => {
    return useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const response = await axiosInstance.get('/courses');
            return response.data;
        },
        staleTime: 10 * 60 * 1000, 
    });
};
