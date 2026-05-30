import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The advisor's thesis kanban board (columns + items), items normalised with id.
export const useThesisBoard = () => {
    return useQuery({
        queryKey: ['thesis-board'],
        queryFn: async () => {
            const res = await axiosInstance.get('/thesis-tasks/board');
            const d = res.data || {};
            return {
                columns: Array.isArray(d.columns) ? d.columns : [],
                items: (Array.isArray(d.items) ? d.items : []).map(i => ({ ...i, id: i._id }))
            };
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};
