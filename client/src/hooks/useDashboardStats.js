import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

/**
 * Fetches dashboard statistics.
 * Uses staleTime of 5 minutes so it doesn't re-fetch every time user returns to Dashboard.
 */
export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            // Adjust the URL based on your server routes.
            // Assuming we have an /analytics route or similar. 
            // If none exists, this is a placeholder that will be adapted.
            const response = await axiosInstance.get('/analytics/dashboard-stats');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes fresh
        retry: 2
    });
};
