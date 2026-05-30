import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Institution-wide academic report data, with safe defaults.
export const useAcademicReports = () => {
    return useQuery({
        queryKey: ['academic-reports'],
        queryFn: async () => {
            const res = await axiosInstance.get('/academic-reports');
            const d = res.data || {};
            return {
                facultyStats: d.facultyStats || [],
                enrollmentTrends: d.enrollmentTrends || []
            };
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
