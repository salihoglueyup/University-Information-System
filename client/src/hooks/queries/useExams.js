import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const asArray = (d) => (Array.isArray(d) ? d : []);

// Exam results grouped by course.
export const useExamResults = () => useQuery({
    queryKey: ['exam-results'],
    queryFn: async () => asArray((await axiosInstance.get('/exams/results')).data),
    staleTime: 60 * 1000,
    retry: 1,
});

// Upcoming exam schedule with assigned seats.
export const useExamSchedule = () => useQuery({
    queryKey: ['exam-schedule'],
    queryFn: async () => asArray((await axiosInstance.get('/exams/schedule')).data),
    staleTime: 60 * 1000,
    retry: 1,
});
