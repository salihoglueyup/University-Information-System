import axiosInstance from '../api/axiosInstance';
// Served as static assets so they resolve in BOTH dev and production.
// '/src/...' only works under the Vite dev server and 404s in a production build,
// so these JSON records must live under client/public/records (BASE_URL aware).
const recordsPath = `${import.meta.env.BASE_URL}records`;

const getFromApi = async (url) => {
    const res = await axiosInstance.get(url);
    return res.data;
};

export class DataManager {
    static async getFacultyList() {
        try {
            return await getFromApi('/faculties');
        } catch (error) {
            console.error("Error fetching faculties:", error);
            return [];
        }
    }

    static async getDepartmentList() {
        try {
            return await getFromApi('/departments');
        } catch (error) {
            console.error("Error fetching departments:", error);
            return [];
        }
    }

    // --- Master Indices (For Admin Panel) ---

    static async getAllStudents() {
        try {
            return await getFromApi('/students');
        } catch (error) {
            console.error("Error fetching students:", error);
            return [];
        }
    }

    static async getAllRooms() {
        try {
            const response = await fetch(`${recordsPath}/metadata/rooms-index.json`);
            if (!response.ok) throw new Error('Index not found');
            return await response.json();
        } catch {
            console.warn("Room index not found. Run generate-indices.js");
            return [];
        }
    }

    static async getBuildings() {
        try {
            const response = await fetch(`${recordsPath}/campus/metadata/buildings.json`);
            if (!response.ok) throw new Error('Buildings metadata not found');
            return await response.json();
        } catch {
            console.warn("Buildings metadata not found.");
            return [];
        }
    }

    static async getStudent(facultySlug, deptSlug, studentId) {
        const basePath = `${recordsPath}/faculties/${facultySlug}/${deptSlug}/students/${studentId}`;

        try {
            // Core Data
            const [profile, academic, finance, schedule] = await Promise.all([
                fetch(`${basePath}/profile.json`).then(r => r.json()),
                fetch(`${basePath}/academic.json`).then(r => r.json()),
                fetch(`${basePath}/finance.json`).then(r => r.json()),
                fetch(`${basePath}/schedule.json`).then(r => r.json()),
            ]);

            // Expanded Data (Optional - might not exist for all in a real scenario, but our generator makes them)
            const [social, career, projects, library, health, documents, settings, housing, transport] = await Promise.all([
                fetch(`${basePath}/socialTranscript.json`).then(r => r.json().catch(() => ({}))),
                fetch(`${basePath}/career.json`).then(r => r.json().catch(() => ({}))),
                fetch(`${basePath}/projects.json`).then(r => r.json().catch(() => ({}))),
                fetch(`${basePath}/library.json`).then(r => r.json().catch(() => ({}))),
                fetch(`${basePath}/health.json`).then(r => r.json().catch(() => ({}))),
                fetch(`${basePath}/documents.json`).then(r => r.json().catch(() => ({}))),
                fetch(`${basePath}/settings.json`).then(r => r.json().catch(() => ({}))),
                fetch(`${basePath}/housing.json`).then(r => r.json().catch(() => ({}))),
                fetch(`${basePath}/transport.json`).then(r => r.json().catch(() => ({}))),
            ]);

            return {
                ...profile,
                ...academic,
                finance,
                schedule,
                social,
                career,
                projects,
                library,
                health,
                documents,
                settings,
                housing,
                transport
            };
        } catch (error) {
            console.error(`Error fetching student data for ${studentId}:`, error);
            return null;
        }
    }

    // New method to list students (for Advisees page)
    // In a real app, this would be a backend search API. 
    // Here, we might need a manifest or just try to fetch a known range if we don't have a directory listing API in frontend.
    // For now, let's assume we pass a list of IDs or we rely on a pre-generated manifest file.
    // TODO: Create a department-manifest.json in the generator for easier listing.

    static async getCourseDetail(courseCode) {
        const basePath = `${recordsPath}/courses/${courseCode}`;
        try {
            const [metadata, syllabus, resources, assignments, students] = await Promise.all([
                fetch(`${basePath}/metadata.json`).then(r => r.json()),
                fetch(`${basePath}/syllabus.json`).then(r => r.json().catch(() => ({}))),
                fetch(`${basePath}/resources.json`).then(r => r.json().catch(() => ({}))),
                fetch(`${basePath}/assignments.json`).then(r => r.json().catch(() => ({ items: [] }))),
                fetch(`${basePath}/students.json`).then(r => r.json().catch(() => ({ roster: [] }))),
            ]);

            return {
                ...metadata,
                syllabus,
                resources,
                assignments: assignments.items || [],
                students: students.roster || []
            };
        } catch (error) {
            console.error(`Error fetching course data for ${courseCode}:`, error);
            return null;
        }
    }

    static async getInstructorCourses(_instructorId) {
        const demoCourses = ["YZM101", "YZM302", "BIL101"];

        try {
            const courses = await Promise.all(
                demoCourses.map(code => this.getCourseDetail(code))
            );
            return courses.filter(c => c !== null);
        } catch (error) {
            console.error("Error fetching instructor courses:", error);
            return [];
        }
    }
}
