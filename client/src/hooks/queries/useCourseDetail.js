import { useQuery } from '@tanstack/react-query';
import { DataManager } from '../../utils/DataManager';

export const useCourseDetail = (courseId) => {
    return useQuery({
        queryKey: ['course-detail', courseId],
        queryFn: () => DataManager.getCourseDetail(courseId),
        enabled: !!courseId,
        staleTime: 2 * 60 * 1000,
        retry: 1
    });
};

export default useCourseDetail;
