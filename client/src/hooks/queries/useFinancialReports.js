import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Institution-wide financial report data, with safe defaults.
export const useFinancialReports = () => {
    return useQuery({
        queryKey: ['financial-reports'],
        queryFn: async () => {
            const res = await axiosInstance.get('/financial-reports');
            const d = res.data || {};
            return {
                paymentStats: d.paymentStats || [],
                monthlyRevenue: d.monthlyRevenue || []
            };
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
