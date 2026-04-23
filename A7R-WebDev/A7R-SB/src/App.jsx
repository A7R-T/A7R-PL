import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, Code2, Video, Brain, Coins, HeartPulse, GraduationCap, 
  Gamepad2, Dumbbell, Utensils, Moon,
  Target, Trophy, FolderKanban, CheckSquare, Calendar, Activity,
  Library, Book, Search, Plus, X, ChevronRight, ChevronLeft,
  Trash2, Edit3, FileText, Folder, Home, ChevronDown, ChevronUp,
  Clock, Zap, Flag, ListTodo, BarChart3, BookOpen, Save, MoreHorizontal,
  GripVertical, Link2, ChevronLeftCircle, ChevronRightCircle, Grid,
  Type, Hash, List, CheckCircle2, Circle, ArrowRight, Trash,
  Table, ImageIcon, Quote, Code, Heading1, Heading2, Minus, AlignLeft
} from 'lucide-react';
import { DataProvider, useData } from './data/store';

const iconMap = { Shield, Code2, Video, Brain, Coins, HeartPulse, GraduationCap, Gamepad2, Dumbbell, Utensils, Moon };
const colors = { bg: '#0D1721', border: '#2C3E50', accent: '#8CB4D2', highlight: '#B1D3EE', text: '#E1E8ED' };

const getIcon = (name) => iconMap[name] || Shield;

const SymmetryBox = ({ children, className = '' }) => (
  <div className={`bg-white/5 border border-white/5 rounded-xl p-4 ${className}`}>{children}</div>
);

const SectionTitle = ({ children }) => (
  <div className="text-[10px] tracking-[0.3em] opacity-40 mb-3 uppercase">{children}</div>
);

const SectionHeader = ({ children, action }) => (
  <div className="flex items-center justify-between mb-3"><SectionTitle>{children}</SectionTitle>{action}</div>
);

const NavLink = ({ to, children, icon: Icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  return (
    <Link to={to} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isActive ? 'bg-white/10 text-[#B1D3EE]' : 'opacity-50 hover:opacity-100 hover:bg-white/5'}`}>
      <Icon size={14} /><span className="text-[10px] font-bold tracking-wider">{children}</span>
    </Link>
  );
};

// ============ HOME DASHBOARD ============
const HomeDashboard = () => {
  const { data, addTimeBlock, updateTimeBlock, deleteTimeBlock, toggleTaskComplete, updateTrackerValue } = useData();
  const anchors = data.anchors || [];
  const today = new Date().toISOString().split('T')[0];
  
  const allTasks = anchors.flatMap(a => a.tasks?.map(t => ({ ...t, anchorName: a.name, anchorId: a.id })) || []);
  const todayTasks = allTasks.filter(t => t.date === today && !t.completed).slice(0, 8);
  const pinnedTrackers = anchors.flatMap(a => a.trackers?.filter(t => t.pinned) || []).slice(0, 6);
  const habits = data.habits || [];

  const allVisions = anchors.flatMap(a => a.visions?.map(v => ({ ...v, anchor: a.name })) || []);
  const [visionIdx, setVisionIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setVisionIdx(i => (i + 1) % allVisions.length), 5000);
    return () => clearInterval(timer);
  }, [allVisions.length]);

  // Full day time blocking (6am - 11pm)
  const hours = Array.from({ length: 18 }, (_, i) => i + 6);
  const timeBlocks = data.timeBlocking?.filter(b => b.date === today) || [];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Vision Carousel */}
      {allVisions.length > 0 && (
        <div className="flex items-center justify-center gap-4 py-4 border-b border-white/5">
          <Zap size={16} className="text-[#8CB4D2] opacity-50" />
          <span className="text-sm font-medium tracking-wider">{allVisions[visionIdx]?.title}</span>
          <span className="text-[10px] opacity-40">({allVisions[visionIdx]?.anchor})</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Today's Tasks */}
        <div className="lg:col-span-3 space-y-4">
          <SymmetryBox>
            <SectionHeader>TODAY'S TASKS</SectionHeader>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {todayTasks.length === 0 && <div className="text-xs opacity-30">No tasks today</div>}
              {todayTasks.map(task => (
                <button key={task.id} onClick={() => toggleTaskComplete(task.anchorId, task.id)}
                  className="w-full flex items-center gap-3 p-2 bg-white/5 border border-white/5 rounded-lg hover:border-[#8CB4D2] transition-colors">
                  <div className={`w-4 h-4 border rounded flex items-center justify-center ${task.completed ? 'bg-[#8CB4D2] border-[#8CB4D2]' : 'border-white/30'}`}>
                    {task.completed && <CheckSquare size={14} className="text-[#0D1721]" />}
                  </div>
                  <span className="text-xs flex-1 text-left truncate">{task.title}</span>
                  <span className="text-[8px] opacity-40">{task.anchorName}</span>
                </button>
              ))}
            </div>
          </SymmetryBox>

          <SymmetryBox>
            <SectionHeader>HABITS</SectionHeader>
            <div className="space-y-2">
              {habits.map(habit => (
                <div key={habit.id} className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-lg">
                  <span className="text-xs">{habit.name}</span>
                  <div className="flex items-center gap-1"><Zap size={10} className="text-[#8CB4D2]" /><span className="text-xs font-bold">{habit.streak}</span></div>
                </div>
              ))}
            </div>
          </SymmetryBox>
        </div>

        {/* Time Blocking - Full Day */}
        <div className="lg:col-span-6">
          <SymmetryBox>
            <SectionHeader>TIME BLOCKING <span className="text-[10px] opacity-40">{today}</span></SectionHeader>
            <div className="space-y-1 max-h-[60vh] overflow-y-auto">
              {hours.map(hour => {
                const hourStr = `${hour.toString().padStart(2, '0')}:00`;
                const blocks = timeBlocks.filter(b => {
                  const startH = parseInt(b.start.split(':')[0]);
                  const endH = parseInt(b.end.split(':')[0]);
                  return startH <= hour && hour < endH;
                });
                return (
                  <div key={hour} className="flex items-stretch gap-2 min-h-[40px]">
                    <span className="text-[10px] w-12 opacity-40 flex-shrink-0 pt-1">{hourStr}</span>
                    <div className="flex-1 relative">
                      {blocks.map(block => (
                        <div key={block.id} className="absolute inset-0 flex items-center gap-2 px-2 bg-[#8CB4D2]/20 border-l-2 border-[#8CB4D2] rounded-r text-xs overflow-hidden">
                          <span className="truncate flex-1">{block.title}</span>
                          <button onClick={() => deleteTimeBlock(block.id)} className="opacity-0 hover:opacity-100"><X size={10} /></button>
                        </div>
                      ))}
                      {blocks.length === 0 && (
                        <button onClick={() => addTimeBlock({ date: today, title: 'New Event', start: hourStr, end: `${(hour + 1).toString().padStart(2, '0')}:00`, anchor: '', recurring: '' })}
                          className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-30 border border-dashed border-white/20 rounded text-[10px]">
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SymmetryBox>
        </div>

        {/* Goals & Projects & Trackers */}
        <div className="lg:col-span-3 space-y-4">
          <SymmetryBox>
            <SectionHeader>GOALS</SectionHeader>
            <div className="space-y-2 max-h-[25vh] overflow-y-auto">
              {anchors.flatMap(a => a.goals || []).slice(0, 5).map((goal, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-white/5 border border-white/5 rounded-lg">
                  <Flag size={10} className="opacity-40 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs truncate">{goal.title}</div>
                    <div className="h-1 bg-white/10 rounded-full mt-1"><div className="h-full bg-[#8CB4D2]" style={{ width: `${goal.progress}%` }} /></div>
                  </div>
                  <span className="text-[10px] opacity-40">{goal.progress}%</span>
                </div>
              ))}
            </div>
          </SymmetryBox>

          <SymmetryBox>
            <SectionHeader>PROJECTS</SectionHeader>
            <div className="space-y-2">
              {anchors.flatMap(a => a.projects || []).filter(p => p.status === 'active').slice(0, 3).map((proj, i) => (
                <div key={i} className="p-2 bg-white/5 border border-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">{proj.name}</span>
                    <span className="text-[10px] opacity-40">{proj.progress}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full"><div className="h-full bg-[#8CB4D2]" style={{ width: `${proj.progress}%` }} /></div>
                </div>
              ))}
            </div>
          </SymmetryBox>

          <SymmetryBox>
            <Link to="/trackers" className="flex items-center justify-between">
              <SectionTitle>TRACKERS</SectionTitle>
              <ChevronRight size={12} className="opacity-40" />
            </Link>
            <div className="grid grid-cols-2 gap-2">
              {pinnedTrackers.slice(0, 4).map(tracker => (
                <div key={tracker.id} className="p-2 bg-white/5 border border-white/5 rounded-lg text-center">
                  <div className="text-xs font-bold">{tracker.current}</div>
                  <div className="text-[8px] opacity-40">/ {tracker.target}</div>
                </div>
              ))}
            </div>
          </SymmetryBox>
        </div>
      </div>
    </div>
  );
};

// ============ ANCHORS DASHBOARD ============
const AnchorsDashboard = () => {
  const { data } = useData();
  const anchors = data.anchors || [];
  const leftAnchors = anchors.slice(0, 5);
  const rightAnchors = anchors.slice(5, 10);
  const bottomAnchor = anchors[10];

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 space-y-2">
          <SectionTitle>ANCHORS</SectionTitle>
          {leftAnchors.map(anchor => {
            const Icon = getIcon(anchor.icon);
            return (
              <Link key={anchor.id} to={`/anchor/${anchor.id}`}
                className="flex items-center justify-end gap-3 p-3 border-r-2 hover:bg-white/5 transition-colors" style={{ borderColor: colors.accent }}>
                <span className="text-xs font-bold tracking-widest uppercase opacity-60">{anchor.name}</span>
                <div className="p-2 rounded bg-[#1A2632]"><Icon size={16} /></div>
              </Link>
            );
          })}
        </div>

        <div className="lg:col-span-6">
          <SymmetryBox>
            <div className="grid grid-cols-4 gap-2">
              {['VISIONS', 'GOALS', 'PROJECTS', 'TASKS', 'EVENTS', 'TRACKERS', 'REPOS'].map((label, i) => (
                <Link key={label} to={`/dynamics/${label.toLowerCase()}`}
                  className="flex flex-col items-center justify-center p-4 border border-white/5 bg-white/5 hover:border-[#B1D3EE]/50 hover:bg-[#B1D3EE]/10 transition-all rounded-xl group">
                  <Target size={18} className="mb-2 text-[#8CB4D2] group-hover:text-[#B1D3EE]" />
                  <span className="text-xs font-bold tracking-[0.1em]">{label}</span>
                </Link>
              ))}
            </div>
          </SymmetryBox>

          <div className="mt-4 flex justify-center">
            <Link to={`/anchor/${bottomAnchor?.id}`} className="flex flex-col items-center p-4 border-b-2 border-transparent hover:border-[#B1D3EE] transition-colors">
              <div className="p-3 rounded-full bg-[#1A2632] mb-2">{getIcon(bottomAnchor?.icon)({ size: 16 })}</div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase">{bottomAnchor?.name}</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-2">
          <SectionTitle>ANCHORS</SectionTitle>
          {rightAnchors.map(anchor => {
            const Icon = getIcon(anchor.icon);
            return (
              <Link key={anchor.id} to={`/anchor/${anchor.id}`}
                className="flex items-center justify-start gap-3 p-3 border-l-2 hover:bg-white/5 transition-colors" style={{ borderColor: colors.accent }}>
                <div className="p-2 rounded bg-[#1A2632]"><Icon size={16} /></div>
                <span className="text-xs font-bold tracking-widest uppercase opacity-60">{anchor.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============ 7-DYNAMICS PAGES ============
const VisionsPage = () => {
  const { data, addVision, deleteVision } = useData();
  const anchors = data.anchors || [];
  const visions = anchors.flatMap(a => a.visions?.map(v => ({ ...v, anchor: a.name, anchorId: a.id })) || []);
  const [addAnchor, setAddAnchor] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim() || !addAnchor) return;
    const anchor = anchors.find(a => a.name === addAnchor);
    if (anchor) {
      addVision(anchor.id, { title: newTitle, image: '', desc: '' });
      setNewTitle('');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <SymmetryBox>
        <div className="flex items-center gap-3 mb-6">
          <Target size={24} className="text-[#8CB4D2]" />
          <span className="text-xl font-black tracking-[0.3em]">VISIONS</span>
        </div>

        {/* Add Vision */}
        <div className="flex gap-2 mb-6 p-3 bg-white/5 border border-white/5 rounded-lg">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New vision..."
            className="flex-1 bg-transparent border-b border-white/20 p-2 text-xs outline-none" />
          <select value={addAnchor} onChange={e => setAddAnchor(e.target.value)} className="bg-transparent border-b border-white/20 p-2 text-xs">
            <option value="">Select Anchor</option>
            {anchors.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
          <button onClick={handleAdd} className="p-2 bg-[#8CB4D2] rounded"><Plus size={14} className="text-[#0D1721]" /></button>
        </div>

        {/* Gallery View */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {visions.map(vision => (
            <div key={vision.id} className="p-4 bg-white/5 border border-white/5 rounded-lg hover:border-[#8CB4D2] transition-colors group relative">
              <div className="aspect-video bg-[#1A2632] rounded mb-2 flex items-center justify-center">
                <ImageIcon size={24} className="opacity-20" />
              </div>
              <div className="text-xs font-bold mb-1">{vision.title}</div>
              <div className="text-[8px] opacity-40">{vision.anchor}</div>
              <button onClick={() => deleteVision(vision.anchorId, vision.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                <Trash size={12} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </SymmetryBox>
    </div>
  );
};

const GoalsPage = () => {
  const { data, addGoal, updateGoal, deleteGoal } = useData();
  const anchors = data.anchors || [];
  const goals = anchors.flatMap(a => a.goals?.map(g => ({ ...g, anchor: a.name, anchorId: a.id })) || []);
  const [view, setView] = useState('grid');
  const [newTitle, setNewTitle] = useState('');
  const [newAnchor, setNewAnchor] = useState('');
  const [newTarget, setNewTarget] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim() || !newAnchor) return;
    const anchor = anchors.find(a => a.name === newAnchor);
    if (anchor) {
      addGoal(anchor.id, { title: newTitle, targetDate: newTarget || '2026-12-31', progress: 0, anchor: newAnchor });
      setNewTitle('');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <SymmetryBox>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy size={24} className="text-[#8CB4D2]" />
            <span className="text-xl font-black tracking-[0.3em]">GOALS</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'bg-white/10' : ''}`}><List size={14} /></button>
            <button onClick={() => setView('grid')} className={`p-2 rounded ${view === 'grid' ? 'bg-white/10' : ''}`}><Grid size={14} /></button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 p-3 bg-white/5 border border-white/5 rounded-lg">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New goal..."
            className="flex-1 bg-transparent border-b border-white/20 p-2 text-xs outline-none" />
          <input type="date" value={newTarget} onChange={e => setNewTarget(e.target.value)} className="bg-transparent border-b border-white/20 p-2 text-xs" />
          <select value={newAnchor} onChange={e => setNewAnchor(e.target.value)} className="bg-transparent border-b border-white/20 p-2 text-xs">
            <option value="">Anchor</option>
            {anchors.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
          <button onClick={handleAdd} className="p-2 bg-[#8CB4D2] rounded"><Plus size={14} className="text-[#0D1721]" /></button>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goals.map((goal, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold">{goal.title}</span>
                  <button onClick={() => deleteGoal(goal.anchorId, goal.id)}><Trash size={12} className="opacity-50" /></button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] opacity-40">{goal.anchor}</span>
                  <span className="text-[10px] opacity-40">Due: {goal.targetDate}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full"><div className="h-full bg-[#8CB4D2]" style={{ width: `${goal.progress}%` }} /></div>
                <div className="flex justify-between mt-1"><span className="text-[10px] opacity-40">Progress</span><span className="text-xs font-bold">{goal.progress}%</span></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {goals.map((goal, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-lg">
                <Flag size={14} className="text-[#8CB4D2]" />
                <span className="flex-1 text-sm">{goal.title}</span>
                <span className="text-[10px] opacity-40">{goal.anchor}</span>
                <span className="text-xs font-bold w-12 text-right">{goal.progress}%</span>
              </div>
            ))}
          </div>
        )}
      </SymmetryBox>
    </div>
  );
};

const ProjectsPage = () => {
  const { data, addProject, updateProject, deleteProject } = useData();
  const anchors = data.anchors || [];
  const projects = anchors.flatMap(a => a.projects?.map(p => ({ ...p, anchor: a.name, anchorId: a.id })) || []);
  const [view, setView] = useState('kanban');
  const [newName, setNewName] = useState('');
  const [newAnchor, setNewAnchor] = useState('');

  const handleAdd = () => {
    if (!newName.trim() || !newAnchor) return;
    const anchor = anchors.find(a => a.name === newAnchor);
    if (anchor) {
      addProject(anchor.id, { name: newName, status: 'active', progress: 0, nextActions: [], anchor: newAnchor });
      setNewName('');
    }
  };

  const statuses = ['active', 'in-progress', 'completed'];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <SymmetryBox>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FolderKanban size={24} className="text-[#8CB4D2]" />
            <span className="text-xl font-black tracking-[0.3em]">PROJECTS</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setView('kanban')} className={`p-2 rounded ${view === 'kanban' ? 'bg-white/10' : ''}`}><FolderKanban size={14} /></button>
            <button onClick={() => setView('gallery')} className={`p-2 rounded ${view === 'gallery' ? 'bg-white/10' : ''}`}><Grid size={14} /></button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 p-3 bg-white/5 border border-white/5 rounded-lg">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New project..."
            className="flex-1 bg-transparent border-b border-white/20 p-2 text-xs outline-none" />
          <select value={newAnchor} onChange={e => setNewAnchor(e.target.value)} className="bg-transparent border-b border-white/20 p-2 text-xs">
            <option value="">Anchor</option>
            {anchors.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
          <button onClick={handleAdd} className="p-2 bg-[#8CB4D2] rounded"><Plus size={14} className="text-[#0D1721]" /></button>
        </div>

        {view === 'kanban' ? (
          <div className="grid grid-cols-3 gap-4">
            {statuses.map(status => (
              <div key={status} className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider opacity-60">{status}</div>
                {projects.filter(p => p.status === status).map((proj, i) => (
                  <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-lg group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold">{proj.name}</span>
                      <button onClick={() => deleteProject(proj.anchorId, proj.id)} className="opacity-0 group-hover:opacity-100"><Trash size={10} /></button>
                    </div>
                    <div className="text-[8px] opacity-40 mb-2">{proj.anchor}</div>
                    <div className="h-1 bg-white/10 rounded-full"><div className="h-full bg-[#8CB4D2]" style={{ width: `${proj.progress}%` }} /></div>
                    <div className="text-[10px] text-right mt-1">{proj.progress}%</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {projects.map((proj, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold">{proj.name}</span>
                  <span className="text-[8px] px-2 py-0.5 rounded bg-white/10 uppercase">{proj.status}</span>
                </div>
                <div className="text-[10px] opacity-40 mb-2">{proj.anchor}</div>
                <div className="h-2 bg-white/10 rounded-full"><div className="h-full bg-[#8CB4D2]" style={{ width: `${proj.progress}%` }} /></div>
              </div>
            ))}
          </div>
        )}
      </SymmetryBox>
    </div>
  );
};

const TasksPage = () => {
  const { data, addTask, updateTask, deleteTask, toggleTaskComplete } = useData();
  const anchors = data.anchors || [];
  const [filterAnchor, setFilterAnchor] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  
  let tasks = anchors.flatMap(a => a.tasks?.map(t => ({ ...t, anchor: a.name, anchorId: a.id })) || []);
  if (filterAnchor) tasks = tasks.filter(t => t.anchor === filterAnchor);
  if (!showCompleted) tasks = tasks.filter(t => !t.completed);
  tasks = tasks.sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0));

  const [newTitle, setNewTitle] = useState('');
  const [newTaskAnchor, setNewTaskAnchor] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim() || !newTaskAnchor) return;
    const anchor = anchors.find(a => a.name === newTaskAnchor);
    if (anchor) {
      addTask(anchor.id, { title: newTitle, date: today, anchor: newTaskAnchor });
      setNewTitle('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <SymmetryBox>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ListTodo size={24} className="text-[#8CB4D2]" />
            <span className="text-xl font-black tracking-[0.3em]">TASKS</span>
          </div>
          <div className="flex gap-2">
            <select value={filterAnchor} onChange={e => setFilterAnchor(e.target.value)} className="bg-transparent border border-white/20 p-1 text-xs rounded">
              <option value="">All Anchors</option>
              {anchors.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
            </select>
            <button onClick={() => setShowCompleted(!showCompleted)} className={`p-1 rounded ${showCompleted ? 'bg-white/10' : ''}`}>
              <CheckSquare size={14} />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 p-3 bg-white/5 border border-white/5 rounded-lg">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New task..."
            className="flex-1 bg-transparent border-b border-white/20 p-2 text-xs outline-none" />
          <select value={newTaskAnchor} onChange={e => setNewTaskAnchor(e.target.value)} className="bg-transparent border-b border-white/20 p-2 text-xs">
            <option value="">Anchor</option>
            {anchors.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
          <button onClick={handleAdd} className="p-2 bg-[#8CB4D2] rounded"><Plus size={14} className="text-[#0D1721]" /></button>
        </div>

        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className={`flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-lg ${task.completed ? 'opacity-50' : ''}`}>
              <button onClick={() => toggleTaskComplete(task.anchorId, task.id)} className={`w-5 h-5 border rounded flex items-center justify-center ${task.completed ? 'bg-[#8CB4D2] border-[#8CB4D2]' : 'border-white/30'}`}>
                {task.completed && <CheckSquare size={14} className="text-[#0D1721]" />}
              </button>
              <span className={`flex-1 text-sm ${task.completed ? 'line-through' : ''}`}>{task.title}</span>
              <span className="text-[8px] opacity-40">{task.date}</span>
              <span className="text-[8px] px-2 py-0.5 rounded bg-white/10">{task.anchor}</span>
              <button onClick={() => deleteTask(task.anchorId, task.id)} className="opacity-0 hover:opacity-100"><Trash size={12} /></button>
            </div>
          ))}
        </div>
      </SymmetryBox>
    </div>
  );
};

const EventsPage = () => {
  const { data, addEvent, deleteEvent, updateEvent, addTimeBlock, updateTimeBlock, deleteTimeBlock } = useData();
  const [view, setView] = useState('week');
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(today);
  const anchors = data.anchors || [];

  const getWeekDays = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  };

  const weekDays = getWeekDays(currentWeek);
  const hours = Array.from({ length: 18 }, (_, i) => i + 6);

  const events = anchors.flatMap(a => a.events?.map(e => ({ ...e, anchor: a.name })) || []);
  const timeBlocks = data.timeBlocking || [];

  const getEventsForSlot = (date, hour) => {
    const hourStr = `${hour.toString().padStart(2, '0')}:00`;
    return events.filter(e => e.date === date && parseInt(e.start.split(':')[0]) <= hour && hour < parseInt(e.end.split(':')[0]));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <SymmetryBox>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar size={24} className="text-[#8CB4D2]" />
            <span className="text-xl font-black tracking-[0.3em]">EVENTS</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentWeek(d => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; })}><ChevronLeftCircle size={16} /></button>
            <span className="text-xs">{weekDays[0]} - {weekDays[6]}</span>
            <button onClick={() => setCurrentWeek(d => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; })}><ChevronRightCircle size={16} /></button>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-px">
          <div className="text-[8px] opacity-40"></div>
          {weekDays.map(day => (
            <div key={day} className="text-[8px] text-center opacity-60">{day.slice(5)}</div>
          ))}

          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="text-[8px] opacity-40 text-right pr-1">{hour}:00</div>
              {weekDays.map(day => {
                const dayEvents = getEventsForSlot(day, hour);
                return (
                  <div key={day + hour} className="border border-white/5 min-h-[30px] p-0.5 relative">
                    {dayEvents.map((event, i) => (
                      <div key={i} className="text-[8px] bg-[#8CB4D2]/30 rounded px-1 truncate">{event.title}</div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </SymmetryBox>
    </div>
  );
};

const TrackersPage = () => {
  const { data, updateTrackerValue, addTracker, deleteTracker, updateTracker } = useData();
  const anchors = data.anchors || [];
  const allTrackers = anchors.flatMap(a => a.trackers?.map(t => ({ ...t, anchor: a.name, anchorId: a.id })) || []);
  const [filterAnchor, setFilterAnchor] = useState('');
  const [expandedTracker, setExpandedTracker] = useState(null);

  let trackers = allTrackers;
  if (filterAnchor) trackers = trackers.filter(t => t.anchor === filterAnchor);

  const handleIncrement = (tracker) => {
    updateTrackerValue(tracker.anchorId, tracker.id, 1);
    if (tracker.type === 'journal') {
      updateTracker(tracker.anchorId, tracker.id, { current: tracker.current + 1 });
    }
  };

  const handleDecrement = (tracker) => {
    if (tracker.type === 'scale') {
      updateTrackerValue(tracker.anchorId, tracker.id, -1);
    } else {
      updateTrackerValue(tracker.anchorId, tracker.id, -1);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <SymmetryBox>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 size={24} className="text-[#8CB4D2]" />
            <span className="text-xl font-black tracking-[0.3em]">TRACKERS</span>
          </div>
          <select value={filterAnchor} onChange={e => setFilterAnchor(e.target.value)} className="bg-transparent border border-white/20 p-2 text-xs rounded">
            <option value="">All Anchors</option>
            {anchors.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trackers.map(tracker => (
            <div key={tracker.id} className="p-4 bg-white/5 border border-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-bold">{tracker.name}</div>
                  <div className="text-[8px] opacity-40">{tracker.anchor}</div>
                </div>
                <button onClick={() => deleteTracker(tracker.anchorId, tracker.id)}><Trash size={12} className="opacity-50" /></button>
              </div>

              <div className="flex items-center justify-center gap-4 mb-3">
                {tracker.type !== 'scale' && tracker.type !== 'number' && (
                  <button onClick={() => handleDecrement(tracker)} className="w-10 h-10 border border-white/20 rounded flex items-center justify-center text-lg">-</button>
                )}
                <div className="text-2xl font-bold">{tracker.current}</div>
                {tracker.type !== 'scale' && tracker.type !== 'number' && (
                  <button onClick={() => handleIncrement(tracker)} className="w-10 h-10 border border-white/20 rounded flex items-center justify-center text-lg">+</button>
                )}
              </div>

              <div className="text-center text-xs opacity-40 mb-2">/ {tracker.target} {tracker.unit}</div>

              {tracker.type !== 'scale' && tracker.type !== 'number' && (
                <div className="h-2 bg-white/10 rounded-full">
                  <div className="h-full bg-[#8CB4D2]" style={{ width: `${Math.min(100, (tracker.current / tracker.target) * 100)}%` }} />
                </div>
              )}

              {tracker.type === 'scale' && (
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <button key={n} onClick={() => updateTrackerValue(tracker.anchorId, tracker.id, n - tracker.current, { value: n })}
                      className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${tracker.current === n ? 'bg-[#8CB4D2] text-[#0D1721]' : 'border border-white/20'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              )}

              {tracker.type === 'journal' && (
                <button onClick={() => setExpandedTracker(tracker.id)} className="w-full mt-2 p-2 text-xs border border-white/20 rounded">Add Entry</button>
              )}
            </div>
          ))}
        </div>
      </SymmetryBox>
    </div>
  );
};

const ReposPage = () => {
  const { data, addNotebook, deleteNotebook, addNote, updateNote, deleteNote } = useData();
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const anchors = data.anchors || [];

  const notebooks = anchors.flatMap(a => 
    a.repos?.notebooks?.map(nb => ({ ...nb, anchor: a.name, anchorId: a.id })) || []
  );

  const currentNotebook = notebooks.find(nb => nb.id === selectedNotebook);
  const currentNote = currentNotebook?.notes.find(n => n.id === selectedNote);

  const handleAddNotebook = (anchorId) => {
    const name = prompt('Notebook name:');
    if (name) addNotebook(anchorId, name);
  };

  const handleAddNote = () => {
    if (!selectedNotebook || !noteTitle.trim()) return;
    const notebook = currentNotebook;
    const anchor = anchors.find(a => a.id === notebook?.anchorId);
    if (anchor) {
      addNote(anchor.id, selectedNotebook, { title: noteTitle, content: noteContent });
      setNoteTitle('');
      setNoteContent('');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <SymmetryBox>
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={24} className="text-[#8CB4D2]" />
          <span className="text-xl font-black tracking-[0.3em]">REPOSITORIES</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Notebooks Sidebar */}
          <div className="space-y-2">
            <SectionTitle>NOTEBOOKS</SectionTitle>
            {notebooks.map(nb => (
              <button key={nb.id} onClick={() => { setSelectedNotebook(nb.id); setSelectedNote(null); }}
                className={`w-full flex items-center gap-2 p-2 rounded text-left ${selectedNotebook === nb.id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                <Folder size={14} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate">{nb.name}</div>
                  <div className="text-[8px] opacity-40">{nb.anchor} ({nb.notes?.length || 0})</div>
                </div>
              </button>
            ))}
          </div>

          {/* Notes Grid */}
          <div className="lg:col-span-3">
            {!selectedNotebook ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {notebooks.flatMap(nb => nb.notes || []).map(note => (
                  <button key={note.id} onClick={() => { setSelectedNotebook(nb.id); setSelectedNote(note.id); }}
                    className="p-4 bg-white/5 border border-white/5 rounded-lg text-left hover:border-[#8CB4D2] transition-colors">
                    <div className="text-sm font-bold mb-1">{note.title}</div>
                    <div className="text-[8px] opacity-40">{note.created?.slice(0, 10)}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setSelectedNotebook(null)}><ChevronLeft size={16} /></button>
                  <span className="flex-1 text-center font-bold">{currentNotebook?.name}</span>
                  <button onClick={() => setEditMode(true)} className="p-1 border border-white/20 rounded"><Plus size={14} /></button>
                </div>

                {editMode ? (
                  <div className="space-y-3 p-4 bg-white/5 border border-white/5 rounded-lg">
                    <input value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="Page title..."
                      className="w-full bg-transparent border-b border-white/20 p-2 text-sm outline-none" />
                    <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="Write your content..."
                      rows={10} className="w-full bg-transparent border border-white/20 p-2 text-xs outline-none resize-none" />
                    <div className="flex gap-2">
                      <button onClick={handleAddNote} className="flex-1 p-2 bg-[#8CB4D2] text-[#0D1721] text-xs font-bold rounded">SAVE</button>
                      <button onClick={() => setEditMode(false)} className="p-2 border border-white/20 text-xs rounded">CANCEL</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentNotebook?.notes?.map(note => (
                      <div key={note.id} className="p-4 bg-white/5 border border-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-bold">{note.title}</div>
                          <button onClick={() => deleteNote(currentNotebook.anchorId, selectedNotebook, note.id)}><Trash size={10} /></button>
                        </div>
                        <div className="text-xs opacity-60 whitespace-pre-wrap">{note.content}</div>
                        <div className="text-[8px] opacity-40 mt-2">{note.created?.slice(0, 10)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </SymmetryBox>
    </div>
  );
};

// ============ ANCHOR DETAIL PAGE ============
const AnchorDetail = ({ anchorId }) => {
  const { data, addVision, addGoal, addProject, addTask, addTracker, addEvent } = useData();
  const navigate = useNavigate();
  const anchor = data.anchors?.find(a => a.id === parseInt(anchorId));
  if (!anchor) return null;

  const Icon = getIcon(anchor.icon);
  const [newItem, setNewItem] = useState({ type: '', title: '', target: '' });

  const handleAdd = () => {
    if (!newItem.title.trim()) return;
    switch (newItem.type) {
      case 'vision': addVision(anchor.id, { title: newItem.title, image: '', desc: '' }); break;
      case 'goal': addGoal(anchor.id, { title: newItem.title, targetDate: newItem.target || '2026-12-31', progress: 0 }); break;
      case 'project': addProject(anchor.id, { name: newItem.title, status: 'active', progress: 0, nextActions: [] }); break;
      case 'task': addTask(anchor.id, { title: newItem.title, date: new Date().toISOString().split('T')[0] }); break;
      case 'tracker': addTracker(anchor.id, { name: newItem.title, type: 'counter', target: 100, current: 0, pinned: false }); break;
    }
    setNewItem({ type: '', title: '', target: '' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <SymmetryBox>
        <div className="flex items-center gap-4 mb-6">
          <Link to="/anchors"><ChevronLeft size={20} /></Link>
          <div className="p-4 rounded-full bg-[#1A2632]"><Icon size={32} /></div>
          <div>
            <span className="text-2xl font-black tracking-[0.3em]">{anchor.name}</span>
            <div className="text-[10px] opacity-40">7-DYNAMICS VIEW</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { id: 'vision', label: 'VISIONS', icon: Target },
            { id: 'goal', label: 'GOALS', icon: Trophy },
            { id: 'project', label: 'PROJECTS', icon: FolderKanban },
            { id: 'task', label: 'TASKS', icon: ListTodo },
            { id: 'event', label: 'EVENTS', icon: Calendar, onClick: () => navigate(`/dynamics/events?anchor=${anchor.name}`) },
            { id: 'tracker', label: 'TRACKERS', icon: BarChart3 },
            { id: 'repos', label: 'REPOS', icon: BookOpen, onClick: () => navigate(`/repos?anchor=${anchor.name}`) }
          ].map(dyn => (
            <button key={dyn.id} onClick={dyn.onClick}
              className="flex flex-col items-center justify-center p-3 border border-white/5 bg-white/5 hover:border-[#B1D3EE]/50 rounded-lg group">
              <dyn.icon size={16} className="mb-1 text-[#8CB4D2]" />
              <span className="text-[10px] font-bold">{dyn.label}</span>
            </button>
          ))}
        </div>

        {/* Quick Add */}
        <div className="flex gap-2 p-3 bg-white/5 border border-white/5 rounded-lg mb-4">
          <select value={newItem.type} onChange={e => setNewItem({ ...newItem, type: e.target.value })} className="bg-transparent border-b border-white/20 p-1 text-xs">
            <option value="">Add...</option>
            <option value="vision">Vision</option>
            <option value="goal">Goal</option>
            <option value="project">Project</option>
            <option value="task">Task</option>
            <option value="tracker">Tracker</option>
          </select>
          <input value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} placeholder="Title..." className="flex-1 bg-transparent border-b border-white/20 p-1 text-xs" />
          {newItem.type === 'goal' && <input type="date" value={newItem.target} onChange={e => setNewItem({ ...newItem, target: e.target.value })} className="bg-transparent border-b border-white/20 p-1 text-xs" />}
          <button onClick={handleAdd} className="p-1 bg-[#8CB4D2] rounded"><Plus size={14} className="text-[#0D1721]" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-[10px] opacity-40 mb-2">VISIONS ({anchor.visions?.length || 0})</div>
            <div className="flex flex-wrap gap-2">
              {anchor.visions?.map(v => <span key={v.id} className="px-2 py-1 bg-white/5 rounded text-xs">{v.title}</span>)}
            </div>
          </div>
          <div>
            <div className="text-[10px] opacity-40 mb-2">GOALS ({anchor.goals?.length || 0})</div>
            <div className="flex flex-wrap gap-2">
              {anchor.goals?.map(g => <span key={g.id} className="px-2 py-1 bg-white/5 rounded text-xs">{g.title} ({g.progress}%)</span>)}
            </div>
          </div>
          <div>
            <div className="text-[10px] opacity-40 mb-2">PROJECTS ({anchor.projects?.length || 0})</div>
            <div className="flex flex-wrap gap-2">
              {anchor.projects?.map(p => <span key={p.id} className="px-2 py-1 bg-white/5 rounded text-xs">{p.name} ({p.progress}%)</span>)}
            </div>
          </div>
          <div>
            <div className="text-[10px] opacity-40 mb-2">TRACKERS ({anchor.trackers?.length || 0})</div>
            <div className="flex flex-wrap gap-2">
              {anchor.trackers?.map(t => <span key={t.id} className="px-2 py-1 bg-white/5 rounded text-xs">{t.name}: {t.current}/{t.target}</span>)}
            </div>
          </div>
        </div>
      </SymmetryBox>
    </div>
  );
};

// ============ LAYOUT ============
const Layout = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);

  return (
    <div className="min-h-screen w-full flex flex-col font-sans selection:bg-[#B1D3EE] selection:text-[#0D1721]" style={{ backgroundColor: colors.bg, color: colors.text }}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${colors.border} 1px, transparent 1px), linear-gradient(90deg, ${colors.border} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <nav className="w-full p-3 flex items-center justify-between border-b border-white/5 relative z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center"><img src="assets/A7R.png" alt="LOGO" className="w-full h-full object-contain" /></div>
          <span className="text-base font-black tracking-[0.2em]" style={{ color: colors.highlight }}>A7R</span>
        </Link>
        <div className="flex items-center gap-1">
          <NavLink to="/" icon={Home}>HOME</NavLink>
          <NavLink to="/anchors" icon={Shield}>ANCHORS</NavLink>
          <NavLink to="/dynamics/visions" icon={Target}>DYNAMICS</NavLink>
          <NavLink to="/trackers" icon={BarChart3}>TRACKERS</NavLink>
          <NavLink to="/repos" icon={BookOpen}>REPOS</NavLink>
        </div>
        <div className="flex items-center gap-3 text-[10px] opacity-30 font-mono">
          <span>{currentTime.getHours()}H {currentTime.getMinutes()}M</span>
          <span>v2.0.4</span>
        </div>
      </nav>

      <main className="flex-1 relative z-10 overflow-auto">{children}</main>

      <div className="fixed top-0 left-0 w-12 h-12 border-l border-t opacity-10 m-2 pointer-events-none" style={{ borderColor: colors.highlight }} />
      <div className="fixed top-0 right-0 w-12 h-12 border-r border-t opacity-10 m-2 pointer-events-none" style={{ borderColor: colors.highlight }} />
      <div className="fixed bottom-0 left-0 w-12 h-12 border-l border-b opacity-10 m-2 pointer-events-none" style={{ borderColor: colors.highlight }} />
      <div className="fixed bottom-0 right-0 w-12 h-12 border-r border-b opacity-10 m-2 pointer-events-none" style={{ borderColor: colors.highlight }} />
    </div>
  );
};

// ============ APP ============
const App = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomeDashboard />} />
            <Route path="/anchors" element={<AnchorsDashboard />} />
            <Route path="/anchor/:anchorId" element={<AnchorDetail />} />
            <Route path="/dynamics/visions" element={<VisionsPage />} />
            <Route path="/dynamics/goals" element={<GoalsPage />} />
            <Route path="/dynamics/projects" element={<ProjectsPage />} />
            <Route path="/dynamics/tasks" element={<TasksPage />} />
            <Route path="/dynamics/events" element={<EventsPage />} />
            <Route path="/trackers" element={<TrackersPage />} />
            <Route path="/repos" element={<ReposPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;