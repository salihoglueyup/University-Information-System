import { useQuery } from '@tanstack/react-query';
import { DataManager } from '../../utils/DataManager';

export const useFaculties = () => {
    return useQuery({
        queryKey: ['faculties'],
        queryFn: DataManager.getFacultyList,
        staleTime: 5 * 60 * 1000,
        retry: 1
    });
};

export default useFaculties;
