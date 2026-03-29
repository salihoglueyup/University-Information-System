import { useQuery } from '@tanstack/react-query';
import { DataManager } from '../../utils/DataManager';

const getCampusData = async () => {
    const [buildings, allRooms] = await Promise.all([
        DataManager.getBuildings(),
        DataManager.getAllRooms()
    ]);

    return {
        buildings: buildings || [],
        allRooms: allRooms || []
    };
};

export const useCampusData = () => {
    return useQuery({
        queryKey: ['campus-data'],
        queryFn: getCampusData,
        staleTime: 5 * 60 * 1000,
        retry: 1
    });
};

export default useCampusData;