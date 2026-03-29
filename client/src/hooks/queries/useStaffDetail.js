import { useQuery } from '@tanstack/react-query';

const recordsPath = '/src/data/records';

const readJson = async (path, fallback = null) => {
    const response = await fetch(path);
    if (!response.ok) {
        if (fallback !== null) {
            return fallback;
        }
        throw new Error(`Failed to read ${path}`);
    }
    return response.json();
};

const getStaffDetail = async ({ facultySlug, deptSlug, staffId }) => {
    const basePath = `${recordsPath}/faculties/${facultySlug}/${deptSlug}/staff/${staffId}`;

    const [profile, schedule, research, administrative, qualifications, awards, performance, advisees] = await Promise.all([
        readJson(`${basePath}/profile.json`),
        readJson(`${basePath}/schedule.json`, {}),
        readJson(`${basePath}/research.json`, {}),
        readJson(`${basePath}/administrative.json`, {}),
        readJson(`${basePath}/qualifications.json`, {}),
        readJson(`${basePath}/awards.json`, {}),
        readJson(`${basePath}/performance.json`, {}),
        readJson(`${basePath}/advisees.json`, {})
    ]);

    return {
        ...profile,
        schedule,
        research,
        administrative,
        qualifications,
        awards,
        performance,
        advisees
    };
};

export const useStaffDetail = (facultySlug, deptSlug, staffId) => {
    return useQuery({
        queryKey: ['staff-detail', facultySlug, deptSlug, staffId],
        queryFn: () => getStaffDetail({ facultySlug, deptSlug, staffId }),
        enabled: !!facultySlug && !!deptSlug && !!staffId,
        staleTime: 2 * 60 * 1000,
        retry: 1
    });
};

export default useStaffDetail;