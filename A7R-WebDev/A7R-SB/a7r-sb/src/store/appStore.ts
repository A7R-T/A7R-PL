import { create } from 'zustand';

export interface Page {
  id: string;
  title: string;
  parentId: string | null;
  icon: string;
  content: any;
  createdAt: Date;
  updatedAt: Date;
  isDatabase?: boolean;
  databaseConfig?: DatabaseConfig;
}

export interface DatabaseConfig {
  properties: DatabaseProperty[];
  views: DatabaseView[];
  activeViewId: string;
}

export interface DatabaseProperty {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'multi-select' | 'date' | 'checkbox' | 'person' | 'url' | 'email' | 'phone' | 'formula' | 'rollup' | 'relation' | 'created-time' | 'created-by' | 'last-edited-time' | 'last-edited-by';
  options?: string[];
  formula?: string;
}

export interface DatabaseView {
  id: string;
  name: string;
  type: 'table' | 'board' | 'timeline' | 'calendar' | 'gallery' | 'list';
  filters: Filter[];
  sorts: Sort[];
}

export interface Filter {
  propertyId: string;
  operator: string;
  value: any;
}

export interface Sort {
  propertyId: string;
  direction: 'asc' | 'desc';
}

export interface Task {
  id: string;
  pageId: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  recurring?: string;
  pomodoroEstimate?: number;
}

export interface CalendarEvent {
  id: string;
  pageId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  color?: string;
  repeat?: string;
}

interface AppState {
  pages: Page[];
  activePageId: string | null;
  sidebarOpen: boolean;
  searchOpen: boolean;
  commandPaletteOpen: boolean;
  
  addPage: (parentId?: string) => void;
  deletePage: (id: string) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  setActivePage: (id: string) => void;
  toggleSidebar: () => void;
  toggleSearch: () => void;
  toggleCommandPalette: () => void;
  getPageTree: () => Page[];
  getPage: (id: string) => Page | undefined;
}

const createDefaultPages = (): Page[] => [
  {
    id: 'welcome',
    title: 'Welcome',
    parentId: null,
    icon: '🏠',
    content: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tasks',
    title: 'Tasks',
    parentId: null,
    icon: '✓',
    content: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isDatabase: true,
    databaseConfig: {
      properties: [
        { id: 'title', name: 'Task', type: 'text' },
        { id: 'status', name: 'Status', type: 'select', options: ['To Do', 'In Progress', 'Done'] },
        { id: 'priority', name: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Urgent'] },
        { id: 'due', name: 'Due Date', type: 'date' },
        { id: 'tags', name: 'Tags', type: 'multi-select', options: ['Work', 'Personal', 'Health', 'Learning'] },
      ],
      views: [
        { id: 'table-view', name: 'Table', type: 'table', filters: [], sorts: [] },
        { id: 'board-view', name: 'Board', type: 'board', filters: [], sorts: [] },
        { id: 'calendar-view', name: 'Calendar', type: 'calendar', filters: [], sorts: [] },
      ],
      activeViewId: 'table-view',
    },
  },
  {
    id: 'calendar',
    title: 'Calendar',
    parentId: null,
    icon: '📅',
    content: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'notes',
    title: 'Notes',
    parentId: null,
    icon: '📝',
    content: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  pages: createDefaultPages(),
  activePageId: 'welcome',
  sidebarOpen: true,
  searchOpen: false,
  commandPaletteOpen: false,

  addPage: (parentId?: string) => {
    const newPage: Page = {
      id: globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
      title: 'Untitled',
      parentId: parentId || null,
      icon: '📄',
      content: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      pages: [...state.pages, newPage],
      activePageId: newPage.id,
    }));
  },

  deletePage: (id: string) => {
    set((state) => {
      const deleteRecursive = (pageId: string): string[] => {
        const children = state.pages.filter((p) => p.parentId === pageId);
        return [pageId, ...children.flatMap((c) => deleteRecursive(c.id))];
      };
      const idsToDelete = deleteRecursive(id);
      return {
        pages: state.pages.filter((p) => !idsToDelete.includes(p.id)),
        activePageId: state.activePageId === id ? 'welcome' : state.activePageId,
      };
    });
  },

  updatePage: (id: string, updates: Partial<Page>) => {
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
    }));
  },

  setActivePage: (id: string) => {
    set({ activePageId: id });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  toggleSearch: () => {
    set((state) => ({ searchOpen: !state.searchOpen }));
  },

  toggleCommandPalette: () => {
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen }));
  },

  getPageTree: () => {
    return get().pages;
  },

  getPage: (id: string) => {
    return get().pages.find((p) => p.id === id);
  },
}));
