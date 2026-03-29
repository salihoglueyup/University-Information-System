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

export const useEnrolledCourses = (userId) => {
    return useQuery({
        queryKey: ['enrolledCourses', userId],
        queryFn: async () => {
            const response = await axiosInstance.get(`/courses/enrolled`);
            return response.data;
        },
        enabled: !!userId, // only fetch if we know the user
        staleTime: 5 * 60 * 1000
    });
};
