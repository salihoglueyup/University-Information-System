import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const DEFAULT_STATUS = { mandatory: { completedDays: 0, totalDays: 30 }, documents: [], history: [] };

// The user's mandatory-internship status.
export const useInternshipStatus = () => {
    return useQuery({
        queryKey: ['internship-status'],
        queryFn: async () => {
            const res = await axiosInstance.get('/internship');
            return res.data || DEFAULT_STATUS;
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

// Global internship listings.
export const useInternshipOffers = () => {
    return useQuery({
        queryKey: ['internship-offers'],
        queryFn: async () => {
            const res = await axiosInstance.get('/internship/offers');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};
