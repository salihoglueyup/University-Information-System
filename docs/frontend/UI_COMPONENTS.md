# UI Components

This document catalogs the reusable UI component library in `client/src/components/ui/`. Components are organized into 13 categories with a barrel export file.

## Component Categories

```
components/ui/
├── index.js                # Barrel export file
├── UbisAiAssistant.jsx     # Global AI assistant widget
├── animation/              # Animation components
├── charts/                 # Data visualization (Recharts)
├── chat/                   # Messaging & chat
├── data-display/           # Tables, lists, data presentation
├── editors/                # Rich text editors (TipTap)
├── feedback/               # Ratings, alerts, toasts
├── forms/                  # Input fields, selects, date pickers
├── layout/                 # Grids, containers, dividers
├── maps/                   # Leaflet map components
├── media/                  # Image viewers, galleries
├── navigation/             # Menus, breadcrumbs, tabs
├── overlay/                # Modals, drawers, popovers
└── theme/                  # Theme switcher, color pickers
```

## Import Pattern

All components are re-exported through a barrel file for clean imports:

```javascript
// client/src/components/ui/index.js
// Import from single entry point:
import { Button, Modal, DataTable, Rating } from '../components/ui';
```

---

## Category Details — Complete Inventory (69 Components)

### 🎭 Animation (1)

| Component | File | Description |
|-----------|------|-------------|
| `Stagger` | `animation/Stagger.jsx` | Staggered entrance animations for child elements |

**Built with:** Framer Motion. **Use for:** Page transitions, loading states, reveal animations.

---

### 📊 Charts (3)

| Component | File | Description |
|-----------|------|-------------|
| `BarChart` | `charts/BarChart.jsx` | Vertical/horizontal bar charts |
| `LineChart` | `charts/LineChart.jsx` | Line and area charts |
| `PieChart` | `charts/PieChart.jsx` | Pie and donut charts |

**Built with:** Recharts. **Use for:** Analytics dashboards, grade distribution, financial reports.

---

### 💬 Chat (1)

| Component | File | Description |
|-----------|------|-------------|
| `CampusAIWidget` | `chat/CampusAIWidget.jsx` | AI-powered campus assistant chat widget |

**Built with:** Socket.io. **Use for:** Real-time messaging, AI-assisted campus queries.

---

### 📋 Data Display (10)

| Component | File | Description |
|-----------|------|-------------|
| `Avatar` | `data-display/Avatar.jsx` | User avatar with initials fallback |
| `AvatarGroup` | `data-display/AvatarGroup.jsx` | Stacked avatar group with overflow |
| `Badge` | `data-display/Badge.jsx` | Status badges and tags |
| `Calendar` | `data-display/Calendar.jsx` | Calendar view for events and schedules |
| `Carousel` | `data-display/Carousel.jsx` | Image/content carousel slider |
| `CountUp` | `data-display/CountUp.jsx` | Animated number counter |
| `DataGrid` | `data-display/DataGrid.jsx` | Advanced data grid with sorting/filtering |
| `KanbanBoard` | `data-display/KanbanBoard.jsx` | Drag-and-drop kanban board |
| `Table` | `data-display/Table.jsx` | Basic data table with headers |
| `Timeline` | `data-display/Timeline.jsx` | Vertical event timeline |
| `TreeView` | `data-display/TreeView.jsx` | Hierarchical tree view |

**Use for:** Student lists, grade tables, thesis kanban, transaction history.

---

### ✏️ Editors (1)

| Component | File | Description |
|-----------|------|-------------|
| `RichTextEditor` | `editors/RichTextEditor.jsx` | Full-featured rich text editor |

**Built with:** TipTap (@tiptap/react). **Use for:** Announcements, syllabus, email composition.

---

### 💡 Feedback (10)

| Component | File | Description |
|-----------|------|-------------|
| `Alert` | `feedback/Alert.jsx` | Alert/notification boxes (info, warning, error, success) |
| `Confetti` | `feedback/Confetti.jsx` | Celebration confetti animation |
| `EmptyState` | `feedback/EmptyState.jsx` | Empty state placeholder with illustration |
| `HoverCard` | `feedback/HoverCard.jsx` | Card that appears on hover |
| `Popover` | `feedback/Popover.jsx` | Floating popover container |
| `ProgressBar` | `feedback/ProgressBar.jsx` | Progress indicator bar |
| `Rating` | `feedback/Rating.jsx` | Star rating component |
| `Skeleton` | `feedback/Skeleton.jsx` | Content skeleton loading placeholders |
| `Toast` | `feedback/Toast.jsx` | Toast notification messages |
| `Tooltip` | `feedback/Tooltip.jsx` | Contextual tooltip on hover |

**Use for:** Course evaluations, loading states, success/error messages, celebrations.

---

### 📝 Forms (14)

| Component | File | Description |
|-----------|------|-------------|
| `Checkbox` | `forms/Checkbox.jsx` | Checkbox with label |
| `DatePicker` | `forms/DatePicker.jsx` | Date selection input |
| `FileUpload` | `forms/FileUpload.jsx` | Drag-and-drop file upload |
| `Input` | `forms/Input.jsx` | Text input field |
| `InputOTP` | `forms/InputOTP.jsx` | OTP (one-time password) input |
| `RadioGroup` | `forms/RadioGroup.jsx` | Radio button group |
| `Select` | `forms/Select.jsx` | Dropdown select menu |
| `SignaturePad` | `forms/SignaturePad.jsx` | Digital signature canvas |
| `Slider` | `forms/Slider.jsx` | Range slider input |
| `Switch` | `forms/Switch.jsx` | Toggle switch |
| `TagInput` | `forms/TagInput.jsx` | Multi-tag input field |
| `Textarea` | `forms/Textarea.jsx` | Multi-line text input |
| `TimePicker` | `forms/TimePicker.jsx` | Time selection input |
| `TransferList` | `forms/TransferList.jsx` | Dual-list transfer selector |

**Integrates with:** React Hook Form + Zod validation. **Use for:** All form-based interactions.

---

### 📐 Layout (11)

| Component | File | Description |
|-----------|------|-------------|
| `Accordion` | `layout/Accordion.jsx` | Collapsible accordion sections |
| `AspectRatio` | `layout/AspectRatio.jsx` | Fixed aspect ratio container |
| `Card` | `layout/Card.jsx` | Content card with header/body/footer |
| `Collapsible` | `layout/Collapsible.jsx` | Collapsible content panel |
| `Drawer` | `layout/Drawer.jsx` | Slide-in side drawer panel |
| `Modal` | `layout/Modal.jsx` | Modal dialog window |
| `PageHeader` | `layout/PageHeader.jsx` | Consistent page header with breadcrumbs |
| `PageTransition` | `layout/PageTransition.jsx` | Animated page transition wrapper |
| `Resizable` | `layout/Resizable.jsx` | Resizable panel container |
| `ScrollArea` | `layout/ScrollArea.jsx` | Custom scrollbar area |
| `Separator` | `layout/Separator.jsx` | Horizontal/vertical divider |

**Use for:** Page structure, content organization, responsive grids.

---

### 🗺️ Maps (1)

| Component | File | Description |
|-----------|------|-------------|
| `MapView` | `maps/MapView.jsx` | Interactive campus map |

**Built with:** React Leaflet. **Use for:** Campus map, building locations, shuttle routes.

---

### 🖼️ Media (4)

| Component | File | Description |
|-----------|------|-------------|
| `AudioPlayer` | `media/AudioPlayer.jsx` | Audio playback component |
| `ImageGallery` | `media/ImageGallery.jsx` | Image gallery with lightbox |
| `ImageViewer` | `media/ImageViewer.jsx` | Zoomable image viewer |
| `VideoPlayer` | `media/VideoPlayer.jsx` | Video playback component |

**Use for:** Profile photos, document previews, multimedia content.

---

### 🧭 Navigation (7)

| Component | File | Description |
|-----------|------|-------------|
| `Breadcrumb` | `navigation/Breadcrumb.jsx` | Breadcrumb trail navigation |
| `Button` | `navigation/Button.jsx` | Primary button component (variants: primary, secondary, ghost, danger) |
| `Dock` | `navigation/Dock.jsx` | macOS-style dock bar |
| `Menubar` | `navigation/Menubar.jsx` | Horizontal menu bar |
| `Pagination` | `navigation/Pagination.jsx` | Page navigation controls |
| `Stepper` | `navigation/Stepper.jsx` | Multi-step progress indicator |
| `Tabs` | `navigation/Tabs.jsx` | Tab-based content navigation |

**Use for:** Dashboard sidebar, page navigation, multi-step forms.

---

### 🪟 Overlay (3)

| Component | File | Description |
|-----------|------|-------------|
| `CommandPalette` | `overlay/CommandPalette.jsx` | Cmd+K style command palette |
| `ContextMenu` | `overlay/ContextMenu.jsx` | Right-click context menu |
| `DropdownMenu` | `overlay/DropdownMenu.jsx` | Dropdown action menu |

**Use for:** Quick actions, context menus, power user features.

---

### 🎨 Theme (1)

| Component | File | Description |
|-----------|------|-------------|
| `ThemeCustomizer` | `theme/ThemeCustomizer.jsx` | Theme customization panel |

**Integrates with:** Zustand `useAppStore` for persistent theme preference.

---

## Special Components

### UbisAiAssistant

**File:** `components/ui/UbisAiAssistant.jsx` (7.8KB)

A floating AI assistant widget available on all dashboard pages:

- Fixed position bottom-right
- Expandable chat interface
- Sends prompts to `POST /api/ai/ask`
- Receives and displays AI responses
- Conversation history within session

### ErrorBoundary

**File:** `components/ErrorBoundary.jsx`

Global React error boundary that catches rendering errors and displays a recovery UI instead of a blank screen.

### PwaInstallPrompt

**File:** `components/PwaInstallPrompt.jsx`

Displays a banner prompting users to install the PWA version of UBIS on supported devices.

---

## Dashboard-Specific Components

```
components/dashboard/
├── admin/              # Admin-specific widgets
└── assignments/        # Assignment-related components
```

These are not part of the reusable UI library but are specific to dashboard functionality.

---

## Design System

### Colors

The app uses Tailwind's `slate` palette as the primary neutral color:

| Context | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Background | `bg-slate-50` | `bg-slate-900` |
| Surface | `bg-white` | `bg-slate-950` |
| Text primary | `text-slate-800` | `text-white` |
| Text secondary | `text-slate-500` | `text-slate-400` |
| Border | `border-gray-200` | `border-slate-800` |
| Accent | `bg-blue-600` | `bg-blue-400` |

### Dark Mode

Implemented via Tailwind's `dark:` variant classes. Theme toggle persists to localStorage via Zustand.

### Animations

Page transitions use Framer Motion:

```jsx
<motion.div
    key={location.pathname}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
>
```

### Icons

All icons from **Lucide React** (`lucide-react`). Usage:

```jsx
import { Bell, Menu, Search } from 'lucide-react';
<Bell size={20} />
```
