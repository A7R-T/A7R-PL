import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'a7r_system_data';

const getInitialData = () => {
  const today = new Date().toISOString().split('T')[0];
  return {
    system: { currentDate: today, version: '2.0.4-LTS' },
    anchors: [
      { id: 1, name: 'Christianity', icon: 'Shield', color: '#8CB4D2', pinned: true,
        visions: [{ id: 1, title: 'Become Christ-like', image: '', desc: '' }, { id: 2, title: 'Lead Bible study group', image: '', desc: '' }],
        goals: [{ id: 1, title: 'Read entire Bible in 2026', targetDate: '2026-12-31', progress: 32, anchor: 'Christianity' }, { id: 2, title: 'Daily prayer journal', targetDate: '2026-12-31', progress: 45, anchor: 'Christianity' }],
        projects: [{ id: 1, name: 'Bible Reading Plan', status: 'active', progress: 65, nextActions: [], anchor: 'Christianity' }],
        tasks: [{ id: 1, title: 'Morning devotional', completed: false, date: today, anchor: 'Christianity', projectId: null, goalId: null }, { id: 2, title: 'Scripture memorization', completed: false, date: today, anchor: 'Christianity', projectId: null, goalId: null }],
        events: [{ id: 1, title: 'Morning Prayer', allDay: false, start: '06:00', end: '06:30', date: today, recurring: 'daily', anchor: 'Christianity' }],
        trackers: [
          { id: 1, name: 'Bible Reading', type: 'counter', target: 365, current: 120, pinned: true, unit: 'days', logs: [] },
          { id: 2, name: 'Prayer Time', type: 'streak', target: 365, current: 45, pinned: true, unit: 'days', logs: [] }
        ],
        repos: { notebooks: [{ id: 1, name: 'Sermon Notes', notes: [{ id: 1, title: 'Faith Over Fear', content: '[]', created: today, blocks: [{ type: 'text', content: 'Key points from Sunday sermon...' }] }] }] }
      },
      { id: 2, name: 'Programming', icon: 'Code2', color: '#89CFF0', pinned: true,
        visions: [{ id: 3, title: 'Best programmer in history', image: '', desc: '' }],
        goals: [{ id: 3, title: 'Complete 10 books in 2026', targetDate: '2026-12-31', progress: 20, anchor: 'Programming' }, { id: 4, title: '500 LeetCode problems', targetDate: '2026-12-31', progress: 18, anchor: 'Programming' }],
        projects: [{ id: 2, name: 'LeetCode Mastery', status: 'active', progress: 35, nextActions: [], anchor: 'Programming' }],
        tasks: [{ id: 3, title: 'Code for 2 hours', completed: false, date: today, anchor: 'Programming', projectId: 2, goalId: null }, { id: 4, title: 'LeetCode daily', completed: false, date: today, anchor: 'Programming', projectId: 2, goalId: 4 }],
        events: [{ id: 2, title: 'Deep Work - Code', allDay: false, start: '09:00', end: '11:00', date: today, recurring: '', anchor: 'Programming' }],
        trackers: [
          { id: 3, name: 'LeetCode', type: 'counter', target: 500, current: 89, pinned: true, unit: 'problems', logs: [] },
          { id: 4, name: 'GitHub Streak', type: 'streak', target: 365, current: 23, pinned: true, unit: 'days', logs: [] }
        ],
        repos: { notebooks: [{ id: 2, name: 'Code Snippets', notes: [] }] }
      },
      { id: 3, name: 'Content-Creation', icon: 'Video', color: '#FF6B6B', pinned: true,
        visions: [{ id: 4, title: 'Build millions of subscribers', image: '', desc: '' }],
        goals: [{ id: 5, title: '100 videos in 2026', targetDate: '2026-12-31', progress: 8, anchor: 'Content-Creation' }],
        projects: [{ id: 3, name: 'YouTube Channel', status: 'active', progress: 28, nextActions: [], anchor: 'Content-Creation' }],
        tasks: [{ id: 5, title: 'Script next video', completed: false, date: today, anchor: 'Content-Creation', projectId: 3, goalId: 5 }],
        events: [ ],
        trackers: [
          { id: 5, name: 'YouTube Views', type: 'counter', target: 100000, current: 12500, pinned: true, unit: 'views', logs: [] },
          { id: 6, name: 'Videos Posted', type: 'counter', target: 52, current: 8, pinned: true, unit: 'videos', logs: [] }
        ],
        repos: { notebooks: [{ id: 3, name: 'Video Ideas', notes: [] }] }
      },
      { id: 4, name: 'Intelligence', icon: 'Brain', color: '#9B59B6', pinned: false,
        visions: [{ id: 5, title: 'Polymath master', image: '', desc: '' }],
        goals: [{ id: 6, title: 'Read 50 books', targetDate: '2026-12-31', progress: 15, anchor: 'Intelligence' }],
        projects: [{ id: 4, name: 'Reading List', status: 'active', progress: 15, nextActions: [], anchor: 'Intelligence' }],
        tasks: [{ id: 6, title: 'Read 30 minutes', completed: false, date: today, anchor: 'Intelligence', projectId: 4, goalId: 6 }],
        events: [],
        trackers: [{ id: 7, name: 'Books Read', type: 'counter', target: 50, current: 8, pinned: false, unit: 'books', logs: [] }],
        repos: { notebooks: [{ id: 4, name: 'Knowledge Base', notes: [] }] }
      },
      { id: 5, name: 'Finance', icon: 'Coins', color: '#27AE60', pinned: false,
        visions: [{ id: 6, title: 'Financial independence', image: '', desc: '', target: 1000000 }],
        goals: [{ id: 7, title: 'Save 50% income', targetDate: '2026-12-31', progress: 35, anchor: 'Finance' }],
        projects: [{ id: 5, name: 'Investment Portfolio', status: 'active', progress: 22, nextActions: [], anchor: 'Finance' }],
        tasks: [{ id: 7, title: 'Track expenses', completed: false, date: today, anchor: 'Finance', projectId: 5, goalId: 7 }],
        events: [],
        trackers: [
          { id: 8, name: 'Net Worth', type: 'number', target: 1000000, current: 125000, pinned: true, unit: '$', logs: [{ date: today, value: 125000 }] },
          { id: 9, name: 'Monthly Income', type: 'number', target: 10000, current: 8500, pinned: true, unit: '$', logs: [] },
          { id: 10, name: 'Monthly Expenses', type: 'number', target: 5000, current: 3200, pinned: true, unit: '$', logs: [] }
        ],
        repos: { notebooks: [{ id: 5, name: 'Investment Log', notes: [] }] }
      },
      { id: 6, name: 'Mental-Health', icon: 'HeartPulse', color: '#E74C3C', pinned: false,
        visions: [{ id: 7, title: 'Inner peace', image: '', desc: '' }],
        goals: [{ id: 8, title: 'Daily meditation', targetDate: '2026-12-31', progress: 40, anchor: 'Mental-Health' }],
        projects: [{ id: 6, name: 'Mindfulness Practice', status: 'active', progress: 40, nextActions: [], anchor: 'Mental-Health' }],
        tasks: [{ id: 8, title: 'Morning meditation', completed: false, date: today, anchor: 'Mental-Health', projectId: 6, goalId: 8 }, { id: 9, title: 'Gratitude journaling', completed: false, date: today, anchor: 'Mental-Health', projectId: 6, goalId: null }],
        events: [{ id: 3, title: 'Meditation', allDay: false, start: '06:30', end: '07:00', date: today, recurring: 'daily', anchor: 'Mental-Health' }],
        trackers: [
          { id: 11, name: 'Mood', type: 'scale', target: 10, current: 7, pinned: true, unit: '/10', logs: [{ date: today, value: 7, note: '' }] },
          { id: 12, name: 'Meditation', type: 'streak', target: 365, current: 12, pinned: true, unit: 'days', logs: [] },
          { id: 13, name: 'Journal', type: 'journal', target: 365, current: 0, pinned: true, unit: 'entries', logs: [{ date: today, emotions: [], note: '', energy: 5 }] }
        ],
        repos: { notebooks: [{ id: 6, name: 'Journal', notes: [] }] }
      },
      { id: 7, name: 'Academics', icon: 'GraduationCap', color: '#F39C12', pinned: false,
        visions: [], goals: [{ id: 9, title: 'Complete degree', targetDate: '2027-06-01', progress: 35, anchor: 'Academics' }],
        projects: [{ id: 7, name: 'Degree Program', status: 'active', progress: 35, nextActions: [], anchor: 'Academics' }],
        tasks: [{ id: 10, title: 'Study 2 hours', completed: false, date: today, anchor: 'Academics', projectId: 7, goalId: 9 }],
        events: [{ id: 4, title: 'Study Session', allDay: false, start: '14:00', end: '16:00', date: today, recurring: '', anchor: 'Academics' }],
        trackers: [{ id: 14, name: 'Course Progress', type: 'percentage', target: 100, current: 35, pinned: false, unit: '%', logs: [] }],
        repos: { notebooks: [{ id: 7, name: 'Course Notes', notes: [] }] }
      },
      { id: 8, name: 'Entertainment', icon: 'Gamepad2', color: '#1ABC9C', pinned: false,
        visions: [], goals: [{ id: 10, title: 'Watch critically', targetDate: '2026-12-31', progress: 10, anchor: 'Entertainment' }],
        projects: [], tasks: [{ id: 11, title: 'Watch critically', completed: false, date: today, anchor: 'Entertainment', projectId: null, goalId: 10 }],
        events: [],
        trackers: [
          { id: 15, name: 'Movies Watched', type: 'counter', target: 100, current: 12, pinned: false, unit: 'movies', logs: [] },
          { id: 16, name: 'Games Played', type: 'counter', target: 50, current: 3, pinned: false, unit: 'games', logs: [] }
        ],
        repos: { notebooks: [{ id: 8, name: 'Reviews', notes: [] }] }
      },
      { id: 9, name: 'Exercise', icon: 'Dumbbell', color: '#3498DB', pinned: false,
        visions: [{ id: 8, title: 'Peak physical condition', image: '', desc: '' }],
        goals: [{ id: 11, title: 'Train 300 days', targetDate: '2026-12-31', progress: 26, anchor: 'Exercise' }],
        projects: [{ id: 8, name: 'Strength Training', status: 'active', progress: 45, nextActions: [], anchor: 'Exercise' }, { id: 9, name: 'Running Program', status: 'active', progress: 20, nextActions: [], anchor: 'Exercise' }],
        tasks: [{ id: 12, title: 'Workout', completed: false, date: today, anchor: 'Exercise', projectId: 8, goalId: 11 }, { id: 13, title: 'Stretching', completed: false, date: today, anchor: 'Exercise', projectId: 8, goalId: null }],
        events: [{ id: 5, title: 'Workout', allDay: false, start: '07:00', end: '08:00', date: today, recurring: 'daily', anchor: 'Exercise' }],
        trackers: [
          { id: 17, name: 'Workouts', type: 'counter', target: 300, current: 78, pinned: true, unit: 'days', logs: [{ date: today, workout: { type: 'Strength', duration: 60, exercises: [] } }] },
          { id: 18, name: 'Gym Streak', type: 'streak', target: 365, current: 15, pinned: true, unit: 'days', logs: [] },
          { id: 19, name: 'Weight', type: 'number', target: 180, current: 185, pinned: false, unit: 'lbs', logs: [{ date: today, value: 185 }] },
          { id: 20, name: 'Body Fat', type: 'percentage', target: 12, current: 18, pinned: false, unit: '%', logs: [] },
          { id: 21, name: 'Measurements', type: 'measurements', target: 0, current: 0, pinned: false, unit: '', logs: [{ date: today, chest: 42, waist: 32, arms: 15, legs: 24 }] }
        ],
        repos: { notebooks: [{ id: 9, name: 'Workout Plans', notes: [] }] }
      },
      { id: 10, name: 'Nutrition', icon: 'Utensils', color: '#2ECC71', pinned: false,
        visions: [], goals: [{ id: 12, title: 'Meal prep weekly', targetDate: '2026-12-31', progress: 60, anchor: 'Nutrition' }],
        projects: [{ id: 10, name: 'Meal Prep', status: 'active', progress: 60, nextActions: [], anchor: 'Nutrition' }],
        tasks: [{ id: 14, title: 'Log meals', completed: false, date: today, anchor: 'Nutrition', projectId: 10, goalId: 12 }, { id: 15, title: 'Drink 3L water', completed: false, date: today, anchor: 'Nutrition', projectId: 10, goalId: null }],
        events: [],
        trackers: [
          { id: 22, name: 'Water Intake', type: 'counter', target: 3650, current: 1800, pinned: true, unit: 'oz', logs: [{ date: today, value: 64 }] },
          { id: 23, name: 'Calories', type: 'number', target: 2500, current: 2100, pinned: false, unit: 'kcal', logs: [] },
          { id: 24, name: 'Protein', type: 'number', target: 180, current: 120, pinned: false, unit: 'g', logs: [] }
        ],
        repos: { notebooks: [{ id: 10, name: 'Recipes', notes: [] }] }
      },
      { id: 11, name: 'Sleep', icon: 'Moon', color: '#8E44AD', pinned: false,
        visions: [], goals: [{ id: 13, title: '8 hours nightly', targetDate: '2026-12-31', progress: 70, anchor: 'Sleep' }],
        projects: [{ id: 11, name: 'Sleep Hygiene', status: 'active', progress: 50, nextActions: [], anchor: 'Sleep' }],
        tasks: [{ id: 16, title: 'Bed by 11pm', completed: false, date: today, anchor: 'Sleep', projectId: 11, goalId: 13 }],
        events: [],
        trackers: [
          { id: 25, name: 'Hours Slept', type: 'number', target: 8, current: 7.5, pinned: true, unit: 'hrs', logs: [{ date: today, value: 7.5 }] },
          { id: 26, name: 'Sleep Quality', type: 'scale', target: 10, current: 8, pinned: true, unit: '/10', logs: [{ date: today, value: 8 }] }
        ],
        repos: { notebooks: [{ id: 11, name: 'Sleep Log', notes: [] }] }
      }
    ],
    timeBlocking: [
      { id: 1, date: today, title: 'Morning Routine', start: '06:00', end: '07:00', anchor: 'Mental-Health', recurring: 'daily' },
      { id: 2, date: today, title: 'Workout', start: '07:00', end: '08:00', anchor: 'Exercise', recurring: 'daily' },
      { id: 3, date: today, title: 'Breakfast', start: '08:00', end: '08:30', anchor: 'Nutrition', recurring: 'daily' },
      { id: 4, date: today, title: 'Deep Work', start: '09:00', end: '11:00', anchor: 'Programming', recurring: 'daily' },
      { id: 5, date: today, title: 'Content Creation', start: '11:00', end: '12:00', anchor: 'Content-Creation', recurring: '' },
      { id: 6, date: today, title: 'Lunch', start: '12:00', end: '12:30', anchor: 'Nutrition', recurring: 'daily' },
      { id: 7, date: today, title: 'Deep Work', start: '13:00', end: '15:00', anchor: 'Programming', recurring: '' },
      { id: 8, date: today, title: 'Study Session', start: '15:00', end: '16:00', anchor: 'Academics', recurring: '' },
      { id: 9, date: today, title: 'Leisure', start: '18:00', end: '19:00', anchor: 'Entertainment', recurring: '' },
      { id: 10, date: today, title: 'Dinner', start: '19:00', end: '19:30', anchor: 'Nutrition', recurring: 'daily' },
      { id: 11, date: today, title: 'Evening Wind Down', start: '21:00', end: '21:30', anchor: 'Sleep', recurring: '' },
      { id: 12, date: today, title: 'Sleep', start: '22:00', end: '06:00', anchor: 'Sleep', recurring: 'daily' }
    ],
    habits: [
      { id: 1, name: 'Morning Prayer', anchor: 'Christianity', streak: 45 },
      { id: 2, name: 'Code 2 Hours', anchor: 'Programming', streak: 23 },
      { id: 3, name: 'LeetCode', anchor: 'Programming', streak: 23 },
      { id: 4, name: 'Workout', anchor: 'Exercise', streak: 15 },
      { id: 5, name: 'Read 30 mins', anchor: 'Intelligence', streak: 8 },
      { id: 6, name: 'Meditation', anchor: 'Mental-Health', streak: 12 }
    ]
  };
};

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(getInitialData);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setData(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const refreshData = () => {
    setData(prev => ({ ...prev }));
  };

  // Anchor CRUD
  const addAnchor = (anchor) => {
    setData(prev => ({ ...prev, anchors: [...prev.anchors, { id: Date.now(), ...anchor }] }));
  };

  const updateAnchor = (id, field, value) => {
    setData(prev => ({ ...prev, anchors: prev.anchors.map(a => a.id === id ? { ...a, [field]: value } : a) }));
  };

  const deleteAnchor = (id) => {
    setData(prev => ({ ...prev, anchors: prev.anchors.filter(a => a.id !== id) }));
  };

  // Vision CRUD
  const addVision = (anchorId, vision) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, visions: [...a.visions, { id: Date.now(), ...vision }] } : a)
    }));
  };

  const updateVision = (anchorId, visionId, updates) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, visions: a.visions.map(v => v.id === visionId ? { ...v, ...updates } : v) } : a)
    }));
  };

  const deleteVision = (anchorId, visionId) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, visions: a.visions.filter(v => v.id !== visionId) } : a)
    }));
  };

  // Goal CRUD
  const addGoal = (anchorId, goal) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, goals: [...a.goals, { id: Date.now(), ...goal }] } : a)
    }));
  };

  const updateGoal = (anchorId, goalId, updates) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, goals: a.goals.map(g => g.id === goalId ? { ...g, ...updates } : g) } : a)
    }));
  };

  const deleteGoal = (anchorId, goalId) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, goals: a.goals.filter(g => g.id !== goalId) } : a)
    }));
  };

  // Project CRUD
  const addProject = (anchorId, project) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, projects: [...a.projects, { id: Date.now(), ...project }] } : a)
    }));
  };

  const updateProject = (anchorId, projectId, updates) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, projects: a.projects.map(p => p.id === projectId ? { ...p, ...updates } : p) } : a)
    }));
  };

  const deleteProject = (anchorId, projectId) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, projects: a.projects.filter(p => p.id !== projectId) } : a)
    }));
  };

  // Task CRUD
  const addTask = (anchorId, task) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, tasks: [...a.tasks, { id: Date.now(), ...task, completed: false }] } : a)
    }));
  };

  const updateTask = (anchorId, taskId, updates) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, tasks: a.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t) } : a)
    }));
  };

  const deleteTask = (anchorId, taskId) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, tasks: a.tasks.filter(t => t.id !== taskId) } : a)
    }));
  };

  const toggleTaskComplete = (anchorId, taskId) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, tasks: a.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) } : a)
    }));
  };

  // Event CRUD
  const addEvent = (anchorId, event) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, events: [...a.events, { id: Date.now(), ...event }] } : a)
    }));
  };

  const updateEvent = (anchorId, eventId, updates) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, events: a.events.map(e => e.id === eventId ? { ...e, ...updates } : e) } : a)
    }));
  };

  const deleteEvent = (anchorId, eventId) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, events: a.events.filter(e => e.id !== eventId) } : a)
    }));
  };

  // Time Blocking CRUD
  const addTimeBlock = (block) => {
    setData(prev => ({ ...prev, timeBlocking: [...prev.timeBlocking, { id: Date.now(), ...block }] }));
  };

  const updateTimeBlock = (id, updates) => {
    setData(prev => ({ ...prev, timeBlocking: prev.timeBlocking.map(b => b.id === id ? { ...b, ...updates } : b) }));
  };

  const deleteTimeBlock = (id) => {
    setData(prev => ({ ...prev, timeBlocking: prev.timeBlocking.filter(b => b.id !== id) }));
  };

  // Tracker CRUD
  const addTracker = (anchorId, tracker) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, trackers: [...a.trackers, { id: Date.now(), ...tracker, logs: [] }] } : a)
    }));
  };

  const updateTracker = (anchorId, trackerId, updates) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, trackers: a.trackers.map(t => t.id === trackerId ? { ...t, ...updates } : t) } : a)
    }));
  };

  const deleteTracker = (anchorId, trackerId) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, trackers: a.trackers.filter(t => t.id !== trackerId) } : a)
    }));
  };

  const updateTrackerValue = (anchorId, trackerId, delta, log = null) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => {
        if (a.id === anchorId) {
          return {
            ...a,
            trackers: a.trackers.map(t => {
              if (t.id === trackerId) {
                if (t.type === 'scale') {
                  const newVal = Math.min(10, Math.max(0, t.current + delta));
                  return { ...t, current: newVal };
                }
                if (t.type === 'number') {
                  const newVal = t.current + delta;
                  return { ...t, current: newVal, logs: log ? [...(t.logs || []), { date: new Date().toISOString().split('T')[0], ...log }] : t.logs };
                }
                return { ...t, current: t.current + delta };
              }
              return t;
            })
          };
        }
        return a;
      })
    }));
  };

  // Notebook CRUD
  const addNotebook = (anchorId, name) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, repos: { ...a.repos, notebooks: [...a.repos.notebooks, { id: Date.now(), name, notes: [] }] } } : a)
    }));
  };

  const deleteNotebook = (anchorId, notebookId) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => a.id === anchorId ? { ...a, repos: { ...a.repos, notebooks: a.repos.notebooks.filter(nb => nb.id !== notebookId) } } : a)
    }));
  };

  // Note CRUD
  const addNote = (anchorId, notebookId, note) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => {
        if (a.id === anchorId) {
          return {
            ...a,
            repos: {
              ...a.repos,
              notebooks: a.repos.notebooks.map(nb => nb.id === notebookId ? { ...nb, notes: [...nb.notes, { id: Date.now(), ...note, created: new Date().toISOString(), blocks: [] }] } : nb)
            }
          };
        }
        return a;
      })
    }));
  };

  const updateNote = (anchorId, notebookId, noteId, updates) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => {
        if (a.id === anchorId) {
          return {
            ...a,
            repos: {
              ...a.repos,
              notebooks: a.repos.notebooks.map(nb => nb.id === notebookId ? { ...nb, notes: nb.notes.map(n => n.id === noteId ? { ...n, ...updates } : n) } : nb)
            }
          };
        }
        return a;
      })
    }));
  };

  const deleteNote = (anchorId, notebookId, noteId) => {
    setData(prev => ({
      ...prev,
      anchors: prev.anchors.map(a => {
        if (a.id === anchorId) {
          return {
            ...a,
            repos: {
              ...a.repos,
              notebooks: a.repos.notebooks.map(nb => nb.id === notebookId ? { ...nb, notes: nb.notes.filter(n => n.id !== noteId) } : nb)
            }
          };
        }
        return a;
      })
    }));
  };

  return (
    <DataContext.Provider value={{
      data, setData, refreshData,
      addAnchor, updateAnchor, deleteAnchor,
      addVision, updateVision, deleteVision,
      addGoal, updateGoal, deleteGoal,
      addProject, updateProject, deleteProject,
      addTask, updateTask, deleteTask, toggleTaskComplete,
      addEvent, updateEvent, deleteEvent,
      addTimeBlock, updateTimeBlock, deleteTimeBlock,
      addTracker, updateTracker, deleteTracker, updateTrackerValue,
      addNotebook, deleteNotebook, addNote, updateNote, deleteNote
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);