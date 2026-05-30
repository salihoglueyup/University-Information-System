import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's co-curricular (social) transcript, with safe defaults.
export const useSocialTranscript = () => {
    return useQuery({
        queryKey: ['social-transcript'],
        queryFn: async () => {
            const res = await axiosInstance.get('/social-transcript');
            const d = res.data || {};
            return {
                requiredPoints: d.requiredPoints || 0,
                badges: d.badges || [],
                categories: d.categories || [],
                extraPoints: d.extraPoints || []
            };
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
