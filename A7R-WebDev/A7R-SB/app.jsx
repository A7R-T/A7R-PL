import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Code2, 
  Video, 
  Brain, 
  Coins, 
  HeartPulse, 
  GraduationCap, 
  Gamepad2, 
  Dumbbell, 
  Utensils, 
  Moon,
  Target,
  Trophy,
  FolderKanban,
  CheckSquare,
  Calendar,
  Activity,
  Library,
  Book,
  Search,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const colors = {
    bg: '#0D1721',
    border: '#2C3E50',
    accent: '#8CB4D2',
    highlight: '#B1D3EE',
    text: '#E1E8ED'
  };

  const anchors = [
    { name: 'Christianity', icon: <Shield size={18} /> },
    { name: 'Programming', icon: <Code2 size={18} /> },
    { name: 'Content-Creation', icon: <Video size={18} /> },
    { name: 'Intelligence', icon: <Brain size={18} /> },
    { name: 'Finance', icon: <Coins size={18} /> },
    { name: 'Mental-Health', icon: <HeartPulse size={18} /> },
    { name: 'Academics', icon: <GraduationCap size={18} /> },
    { name: 'Entertainment', icon: <Gamepad2 size={18} /> },
    { name: 'Exercise', icon: <Dumbbell size={18} /> },
    { name: 'Nutrition', icon: <Utensils size={18} /> },
    { name: 'Sleep', icon: <Moon size={18} /> },
  ];

  // Split anchors for perfect symmetry
  const leftAnchors = anchors.slice(0, 5);
  const rightAnchors = anchors.slice(5, 10);
  const bottomAnchor = anchors[10]; // Sleep at the bottom center

  const dynamics = [
    { label: 'VISIONS', icon: <Target size={16} />, desc: 'Long-term North Stars' },
    { label: 'GOALS', icon: <Trophy size={16} />, desc: 'SMART Objectives' },
    { label: 'PROJECTS', icon: <FolderKanban size={16} />, desc: 'Active Endeavors' },
    { label: 'TASKS', icon: <CheckSquare size={16} />, desc: 'Daily Execution' },
    { label: 'EVENTS', icon: <Calendar size={16} />, desc: 'Time Allocation' },
    { label: 'TRACKERS', icon: <Activity size={16} />, desc: 'Dynamic Metrics' },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-6 font-sans selection:bg-[#B1D3EE] selection:text-[#0D1721]" 
         style={{ backgroundColor: colors.bg, color: colors.text }}>
      
      {/* HUD Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `linear-gradient(${colors.border} 1px, transparent 1px), linear-gradient(90deg, ${colors.border} 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

      {/* Main Symmetrical Container */}
      <div className="w-full max-w-7xl flex flex-col items-center relative z-10">
        
        {/* Header / Logo Section */}
        <header className="flex flex-col items-center mb-12">
          {/* Custom SVG recreation of the A7R Logo for perfect color matching */}
          <div className="w-32 h-32 mb-4 relative flex items-center justify-center">
            <img src="assets/A7R.png" alt="LOGO">
          </div>
          <h1 className="text-3xl font-black tracking-[0.5em] text-center" style={{ color: colors.highlight }}>A7R // SYSTEM</h1>
          <div className="h-[1px] w-48 mt-4 bg-gradient-to-r from-transparent via-[#8CB4D2] to-transparent" />
        </header>

        {/* Triple Column Layout for Extreme Symmetry */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* LEFT WING: Anchors 1-5 */}
          <aside className="lg:col-span-3 flex flex-col gap-4">
            <div className="text-[10px] tracking-[0.3em] opacity-40 mb-2 text-right pr-4">ANCHOR_WING_L</div>
            {leftAnchors.map((anchor) => (
              <div key={anchor.name} className="group cursor-pointer flex items-center justify-end gap-4 p-4 border-r-2 transition-all hover:bg-white/5" style={{ borderColor: colors.accent }}>
                <span className="text-xs font-bold tracking-widest uppercase opacity-60 group-hover:opacity-100">{anchor.name}</span>
                <div className="p-2 rounded-lg bg-[#1A2632] group-hover:text-[#B1D3EE]">{anchor.icon}</div>
              </div>
            ))}
          </aside>

          {/* CENTER CORE: 7-Dynamics & Primary Logo Focus */}
          <main className="lg:col-span-6 flex flex-col items-center px-4">
            <div className="w-full bg-[#1A2632]/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col items-center shadow-2xl">
              <div className="text-[10px] tracking-[0.4em] opacity-40 mb-8">CENTRAL_DYNAMICS_ENGINE</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {dynamics.map((dyn) => (
                  <button key={dyn.label} className="flex flex-col items-center justify-center p-6 border border-white/5 bg-white/5 hover:border-[#B1D3EE]/50 hover:bg-[#B1D3EE]/10 transition-all rounded-xl group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#B1D3EE] scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                    <div className="mb-2 text-[#8CB4D2] group-hover:text-[#B1D3EE]">{dyn.icon}</div>
                    <span className="text-xs font-black tracking-[0.2em]">{dyn.label}</span>
                    <span className="text-[9px] opacity-40 mt-1 tracking-wider uppercase">{dyn.desc}</span>
                  </button>
                ))}
              </div>

              {/* Repositories Section (The 7th Dynamic / Knowledge Layer) */}
              <div className="w-full mt-8 pt-8 border-t border-white/5 flex flex-col items-center">
                <div className="flex gap-8">
                  <div className="flex flex-col items-center group cursor-pointer">
                    <div className="p-4 rounded-full border border-dashed border-white/20 mb-2 group-hover:border-[#B1D3EE] transition-colors">
                      <Library size={24} className="opacity-40 group-hover:opacity-100" />
                    </div>
                    <span className="text-[10px] tracking-[0.2em] font-bold">NOTEBOOKS</span>
                  </div>
                  <div className="flex flex-col items-center group cursor-pointer">
                    <div className="p-4 rounded-full border border-dashed border-white/20 mb-2 group-hover:border-[#B1D3EE] transition-colors">
                      <Book size={24} className="opacity-40 group-hover:opacity-100" />
                    </div>
                    <span className="text-[10px] tracking-[0.2em] font-bold">MASTER_NOTES</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Symmetrical Anchor */}
            <div className="mt-8 group cursor-pointer flex flex-col items-center p-4 border-b-2 border-transparent hover:border-[#B1D3EE] transition-all">
               <div className="p-3 rounded-full bg-[#1A2632] mb-2">{bottomAnchor.icon}</div>
               <span className="text-xs font-bold tracking-[0.3em] uppercase">{bottomAnchor.name}</span>
            </div>
          </main>

          {/* RIGHT WING: Anchors 6-10 */}
          <aside className="lg:col-span-3 flex flex-col gap-4">
            <div className="text-[10px] tracking-[0.3em] opacity-40 mb-2 text-left pl-4">ANCHOR_WING_R</div>
            {rightAnchors.map((anchor) => (
              <div key={anchor.name} className="group cursor-pointer flex items-center justify-start gap-4 p-4 border-l-2 transition-all hover:bg-white/5" style={{ borderColor: colors.accent }}>
                <div className="p-2 rounded-lg bg-[#1A2632] group-hover:text-[#B1D3EE]">{anchor.icon}</div>
                <span className="text-xs font-bold tracking-widest uppercase opacity-60 group-hover:opacity-100">{anchor.name}</span>
              </div>
            ))}
          </aside>
        </div>

        {/* Global System Navigation / Search */}
        <footer className="mt-16 w-full max-w-2xl flex flex-col items-center">
          <div className="w-full flex items-center bg-[#1A2632] border border-white/10 rounded-lg px-6 py-4 focus-within:border-[#B1D3EE] transition-all group shadow-xl">
            <Search size={18} className="opacity-30 group-focus-within:opacity-100" />
            <input 
              type="text" 
              placeholder="SEARCH ACROSS ALL ANCHORS AND REPOSITORIES..." 
              className="bg-transparent border-none outline-none flex-1 px-4 text-xs tracking-widest uppercase placeholder:opacity-20"
            />
            <div className="flex gap-2 opacity-20 text-[10px] font-mono">
              <span className="border border-white/50 px-1 rounded">CTRL</span>
              <span className="border border-white/50 px-1 rounded">K</span>
            </div>
          </div>
          
          <div className="mt-8 flex gap-12 opacity-30 text-[9px] tracking-[0.4em] uppercase font-bold">
            <span>System.Status: Optimal</span>
            <span>Uptime: {currentTime.getHours()}H {currentTime.getMinutes()}M</span>
            <span>Version: 2.0.4-LTS</span>
          </div>
        </footer>
      </div>

      {/* Decorative Symmetry Elements */}
      <div className="fixed top-0 left-0 w-32 h-32 border-l border-t opacity-10 m-4 pointer-events-none" style={{ borderColor: colors.highlight }} />
      <div className="fixed top-0 right-0 w-32 h-32 border-r border-t opacity-10 m-4 pointer-events-none" style={{ borderColor: colors.highlight }} />
      <div className="fixed bottom-0 left-0 w-32 h-32 border-l border-b opacity-10 m-4 pointer-events-none" style={{ borderColor: colors.highlight }} />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-r border-b opacity-10 m-4 pointer-events-none" style={{ borderColor: colors.highlight }} />
    </div>
  );
};

export default App;
