import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Fetches the authenticated user's payment overview:
// { transactions, tuition, cards, spendingData }
export const usePaymentOverview = () => {
    return useQuery({
        queryKey: ['payment-overview'],
        queryFn: async () => {
            const res = await axiosInstance.get('/payments');
            return res.data;
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export default usePaymentOverview;
