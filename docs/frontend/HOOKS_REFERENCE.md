# Hooks Reference

This document catalogs all custom React hooks in the UBIS frontend. Hooks are organized into two categories: **Data Hooks** (TanStack Query wrappers) and **Utility Hooks**.

## Hook Index

| Hook | Type | File | Purpose |
|------|------|------|---------|
| [`useCourses`](#usecourses) | Data | `hooks/useCourses.js` | Fetch all courses |
| [`useGrades`](#usegrades) | Data | `hooks/useGrades.js` | Fetch grades (optionally by user) |
| [`useAnnouncements`](#useannouncements) | Data | `hooks/useAnnouncements.js` | Fetch announcements |
| [`useAttendance`](#useattendance) | Data | `hooks/useAttendance.js` | Fetch attendance records |
| [`useEnrolledCourses`](#useenrolledcourses) | Data | `hooks/useEnrolledCourses.js` | Fetch user's enrolled courses |
| [`useDashboardStats`](#usedashboardstats) | Data | `hooks/useDashboardStats.js` | Fetch dashboard statistics |
| [`useFaculties`](#usefaculties) | Data | `hooks/queries/useFaculties.js` | Fetch all faculties |
| [`useCourseDetail`](#usecoursedetail) | Data | `hooks/queries/useCourseDetail.js` | Fetch single course details |
| [`useCampusData`](#usecampusdata) | Data | `hooks/queries/useCampusData.js` | Fetch campus/map data |
| [`useStaffDetail`](#usestaffdetail) | Data | `hooks/queries/useStaffDetail.js` | Fetch staff member profile |
| [`useClipboard`](#useclipboard) | Utility | `hooks/useClipboard.js` | Copy text to clipboard |
| [`useMediaQuery`](#usemediquery) | Utility | `hooks/useMediaQuery.js` | CSS media query matching |

---

## Data Hooks (TanStack Query)

All data hooks use TanStack Query (`@tanstack/react-query`) for server state management, providing automatic caching, refetching, and loading/error states.

### useCourses

Fetches all courses from the API.

```javascript
import { useCourses } from '../hooks/useCourses';

function CoursesPage() {
    const { data, isLoading, error } = useCourses();
}
```

| Property | Value |
|----------|-------|
| Query key | `['courses']` |
| Endpoint | `GET /api/courses` |
| Stale time | Default (0) |

---

### useGrades

Fetches grades, optionally filtered by user ID.

```javascript
import { useGrades } from '../hooks/useGrades';

// All grades (current user)
const { data } = useGrades();

// Grades for specific user
const { data } = useGrades('664a1b2c...');
```

| Property | Value |
|----------|-------|
| Query key | `['grades', userId]` |
| Endpoint | `GET /api/grades` or `GET /api/grades?userId={id}` |
| Stale time | **2 minutes** |

---

### useAnnouncements

Fetches all announcements.

```javascript
import { useAnnouncements } from '../hooks/useAnnouncements';

const { data, isLoading } = useAnnouncements();
```

| Property | Value |
|----------|-------|
| Query key | `['announcements']` |
| Endpoint | `GET /api/announcements` |
| Stale time | Default |

---

### useAttendance

Fetches attendance records.

```javascript
import { useAttendance } from '../hooks/useAttendance';

const { data } = useAttendance();
```

| Property | Value |
|----------|-------|
| Query key | `['attendance']` |
| Endpoint | `GET /api/attendance` |
| Stale time | Default |

---

### useEnrolledCourses

Fetches the current user's enrolled courses.

```javascript
import { useEnrolledCourses } from '../hooks/useEnrolledCourses';

const { data } = useEnrolledCourses();
```

| Property | Value |
|----------|-------|
| Query key | `['enrolledCourses']` |
| Endpoint | `GET /api/enrolled-courses` |
| Stale time | Default |

---

### useDashboardStats

Fetches dashboard statistics with a longer stale time.

```javascript
import { useDashboardStats } from '../hooks/useDashboardStats';

const { data, isLoading } = useDashboardStats();
```

| Property | Value |
|----------|-------|
| Query key | `['dashboardStats']` |
| Endpoint | `GET /api/analytics/dashboard-stats` |
| Stale time | **5 minutes** |
| Retries | 2 |

---

### useFaculties

Fetches all university faculties.

```javascript
import { useFaculties } from '../hooks/queries/useFaculties';

const { data } = useFaculties();
```

| Property | Value |
|----------|-------|
| Query key | `['faculties']` |
| Endpoint | `GET /api/faculties` |
| Location | `hooks/queries/useFaculties.js` |

---

### useCourseDetail

Fetches detailed information for a single course.

```javascript
import { useCourseDetail } from '../hooks/queries/useCourseDetail';

const { data } = useCourseDetail(courseId);
```

| Property | Value |
|----------|-------|
| Query key | `['courseDetail', courseId]` |
| Endpoint | `GET /api/courses/{courseId}` |
| Location | `hooks/queries/useCourseDetail.js` |

---

### useCampusData

Fetches campus map and building data.

```javascript
import { useCampusData } from '../hooks/queries/useCampusData';

const { data } = useCampusData();
```

| Property | Value |
|----------|-------|
| Query key | `['campusData']` |
| Endpoint | `GET /api/campus` |
| Location | `hooks/queries/useCampusData.js` |

---

### useStaffDetail

Fetches detailed information about a staff member, including their courses and schedule.

```javascript
import { useStaffDetail } from '../hooks/queries/useStaffDetail';

const { staffData, courses, schedule, isLoading } = useStaffDetail(staffId);
```

| Property | Value |
|----------|-------|
| Query keys | `['staffDetail', id]`, `['staffCourses', id]`, `['staffSchedule', id]` |
| Endpoints | `GET /api/users/{id}`, `GET /api/courses?instructor={id}`, `GET /api/schedule?instructor={id}` |
| Location | `hooks/queries/useStaffDetail.js` |
| Multiple queries | Yes — 3 parallel queries via `useQuery` |

---

## Utility Hooks

### useClipboard

Copies text to the system clipboard with a temporary success state.

```javascript
import { useClipboard } from '../hooks/useClipboard';

function CopyButton({ text }) {
    const { onCopy, hasCopied } = useClipboard({ timeout: 2000 });

    return (
        <button onClick={() => onCopy(text)}>
            {hasCopied ? 'Copied!' : 'Copy'}
        </button>
    );
}
```

| Property | Type | Description |
|----------|------|-------------|
| `onCopy(value)` | function | Copies the given string to clipboard |
| `hasCopied` | boolean | `true` for `timeout` ms after successful copy |
| `setValue` | function | Alias for `onCopy` |

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | number | `2000` | Duration (ms) before `hasCopied` resets to `false` |

**Features:**
- Uses `navigator.clipboard.writeText()` (modern Clipboard API)
- Auto-resets `hasCopied` after timeout
- Cleans up timers on unmount
- Graceful error handling (logs to console, sets `hasCopied = false`)

---

### useMediaQuery

Tracks whether a CSS media query matches, updating reactively.

```javascript
import { useMediaQuery } from '../hooks/useMediaQuery';

function ResponsiveComponent() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

    return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
```

| Property | Type | Description |
|----------|------|-------------|
| Return value | boolean | `true` if the media query matches |

**Features:**
- Server-safe (returns `false` when `window` is undefined)
- Listens for `change` events on `MediaQueryList`
- Cleans up listener on unmount
- Updates reactively when the viewport changes

---

## Creating New Hooks

### Data Hook Pattern

```javascript
// hooks/useNewData.js
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export const useNewData = (params) => {
    return useQuery({
        queryKey: ['newData', params],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/api/new-data', { params });
            return data;
        },
        staleTime: 2 * 60 * 1000,  // How long data stays "fresh"
    });
};
```

### Mutation Hook Pattern

```javascript
// hooks/useCreateItem.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export const useCreateItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newItem) => axiosInstance.post('/api/items', newItem),
        onSuccess: () => {
            queryClient.invalidateQueries(['items']); // Refetch list
        },
    });
};
```
