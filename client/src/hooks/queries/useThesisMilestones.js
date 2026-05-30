import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The milestone plan for a single thesis, with safe defaults.
export const useThesisMilestones = (thesisId) => {
    return useQuery({
        queryKey: ['thesis-milestones', thesisId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/thesis-milestones/${thesisId}`);
            const d = res.data || {};
            return {
                student: d.student || '',
                project: d.project || '',
                startDate: d.startDate || '',
                endDate: d.endDate || '',
                milestones: d.milestones || []
            };
        },
        enabled: !!thesisId,
        staleTime: 60 * 1000,
        retry: 1,
    });
};
