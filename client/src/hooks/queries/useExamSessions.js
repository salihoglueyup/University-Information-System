import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Scheduled exam sessions for the proctoring scheduler, normalised with id + safe arrays.
export const useExamSessions = () => {
    return useQuery({
        queryKey: ['exam-sessions'],
        queryFn: async () => {
            const res = await axiosInstance.get('/exam-sessions');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id, classrooms: d.classrooms || [], proctors: d.proctors || [] }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};
